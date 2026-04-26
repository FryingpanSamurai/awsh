import { terminalStateWritable } from "../../../state/TerminalStore.svelte";
import { get } from "svelte/store";
import { cleanInput } from "../../../utils/cleanInput";
import { pwdCommand } from "../../commands/pwd";
import { clearCommand } from "../../commands/clear";

class TerminalEngine {
    constructor() { 
        // instantiate the map and register our commands
        this.commands = new Map();
        this.register(pwdCommand);
        this.register(clearCommand);
    }
    // isntantiate command registry
    commandRegistry(Map) {
        this.commands = Map;
    }
    // this is where we make our 'plugins/commands' available to our system
    register(command) {
        this.commands.set(command.name, command);
    }

    // helper function for the TerminalEngine to update the state
    updateTerminalState(inputMessage, outputMessage) {
        terminalStateWritable.update(currentState => {
            return {
                ...currentState,
                messages: [
                    ...currentState.messages,
                    inputMessage,
                    outputMessage
                ]
            }
        });
    }

    execute(inputMessage) {
        // 1. clean input, parse into command and args
        //    this logic will eventually be refactored to the Parser
        inputMessage = cleanInput(inputMessage);
        let parts = inputMessage.split(" ");
        let cmd = parts[0]; 
        let args = parts.slice(1);
        let command = this.commands.get(cmd);

        // manage state and context
        let state = get(terminalStateWritable);
        let context = {
            state,
            updateState: terminalStateWritable.update
        }

        // 2. compute output and input messages for terminal
        let outputMessage;
        let inputMessageFormatted = { type: "input", content: `$ ${inputMessage}` }

        // need to account for two different commands
        // 1. commands that output a result for the user.
        // 2. commands that alter the state of the machine

        // if command exists
        // lookup command => execute command
        if (command) {
            let result = command.execute(args, context);

            // if the command outputs a result for the user,
            // we need to ingest it by updating the state of the 
            // terminal for the component to refresh the UI
            if (result) {
                outputMessage = { type: "output", content: result }
                this.updateTerminalState(inputMessageFormatted, outputMessage);
            }
        } else {
            // errors will also trigger an update to the terminal for error output message
            let result = `${inputMessage} not a recognized command.`
            outputMessage = { type: "error", content: result };
            this.updateTerminalState(inputMessageFormatted, outputMessage);
        }
    }
}

export default TerminalEngine;