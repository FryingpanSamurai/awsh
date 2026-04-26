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
    // isntantiate command registry, if importing
    commandRegistry(Map) {
        this.commands = Map;
    }
    // this is where we make our plugins available to our system
    register(command) {
        this.commands.set(command.name, command);
    }

    execute(inputMessage) {
        // 1. clean input, parse into command and args
        inputMessage = cleanInput(inputMessage);
        let parts = inputMessage.split(" ");
        let cmd = parts[0]; 
        let args = parts.slice(1);
        let command = this.commands.get(cmd);

        // manage state and context
        let state = get(terminalStateWritable);
        let context = {
            state,
            updateState: terminalStateWritable
        }

        // 2. compute output and input messages for terminal
        let outputMessage;
        let inputMessageFormatted = { type: "input", content: `$ ${inputMessage}` }

        // if command exists
        // lookup command => execute command
        if (command) {
            let result = command.execute(args, context);
            outputMessage = { type: "output", content: result }
        } else {
            let result = `${inputMessage} not a recognized command.`
            outputMessage = { type: "error", content: result };
        }

        // 3. update store
        terminalStateWritable.update(currentState => {
            return {
                ...currentState,
                messages: [
                    ...currentState.messages,
                    inputMessageFormatted,
                    outputMessage
                ]
            }
        });
    }
}


export default TerminalEngine;