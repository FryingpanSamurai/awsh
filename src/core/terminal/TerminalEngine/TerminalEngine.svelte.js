import { terminalStateWritable } from "../../../state/TerminalStore.svelte";
import Parser from "../../terminal/Parser/Parser.svelte";
import { get } from "svelte/store";
import { pwdCommand } from "../../commands/pwd";
import { clearCommand } from "../../commands/clear";
import { whoamiCommand } from "../../commands/whoami";

class TerminalEngine {
    constructor() { 
        // instantiate the map and register our commands
        this.commands = new Map();
        this.register(pwdCommand);
        this.register(clearCommand);
        this.register(whoamiCommand);
    }

    // isntantiate command registry
    commandRegistry(Map) {
        this.commands = Map;
    }

    // this is where we make our 'plugins/commands' available to our system
    register(command) {
        this.commands.set(command.name, command);
        
        // we'll also need to register the commands with aliases
        let aliases = command.aliases;
        aliases.forEach(a => {
            this.commands.set(a, command)
        });
    }

    // update Terminal messages and command history
    updateOutput(inputMessage, outputMessage, myCommand) {
        terminalStateWritable.update(currentState => {
            return {
                ...currentState,
                messages: [
                    ...currentState.messages,
                    inputMessage,
                    outputMessage
                ],
                commandHistory: [
                    ...currentState.commandHistory,
                    myCommand
                ]
            }
        });
    }

    updateCommandHistory(myCommand) {
        terminalStateWritable.update(currentState => {
            return {
                ...currentState,
                commandHistory: [
                    ...currentState.commandHistory,
                    myCommand
                ]
            }
        })
    }

    // updates the index of the state
    updateCommandIndex(commandIndex) {
        terminalStateWritable.update(currentState => {
            return {
                ...currentState,
                commandIndex: commandIndex
            }
        })
    }

    execute(inputMessage) {
        // 1. clean input, parse into command and args
        let myParser = new Parser(inputMessage);
        inputMessage = myParser.cleanedInput;

        // let's now parse the command, options, and args
        let parsed  = myParser.parse()
        let cmd     = parsed.command;
        let args    = parsed.args;
        let options = parsed.options;
        let command = this.commands.get(cmd);

        // manage state and context
        let state = get(terminalStateWritable);
        let context = {
            state,
            updateState: terminalStateWritable.update,
            user: state.user,
            authenticated: state.authenticated
        }

        // 2. compute output and input messages for terminal
        let outputMessage;
        let inputMessageFormatted = { type: "input", content: `$ ${inputMessage}` }

        // need to account for two different commands
        // 1. commands that output a result for the user.
        // 2. commands that alter the state of the machine
        if (command) {
            let result = command.execute(args, options, context);

            // ingest output to update UI
            if (result) {
                outputMessage = { type: "output", content: result }
                this.updateOutput(inputMessageFormatted, outputMessage, inputMessage);
            } else {
                // no output for user, but we need to cache the command for history
                this.updateCommandHistory(inputMessage);
            }
        } else {
            // update needed for error message
            let result = `${inputMessage} not a recognized command.`
            outputMessage = { type: "error", content: result };
            this.updateOutput(inputMessageFormatted, outputMessage, inputMessage);
        }

        // reset the command index after executing the command
        this.updateCommandIndex(get(terminalStateWritable).commandHistory.length - 1);
    }

    fetchPriorCommand() {
        // ok so, the way the history traversal works,
        // we have to get the command prior to decrementing
        // because we reset if we aren't actively scrolling through the history
        let state = get(terminalStateWritable);
        let commandIndex = state.commandIndex;
        let myCommand = state.commandHistory[state.commandIndex];

        // if we are at the 'end' of history, don't decrement
        if (commandIndex > 0) {
            this.updateCommandIndex(commandIndex -= 1);
        }

        return myCommand;
    }

    fetchNextCommand() {
        // however, with next command
        // we need to increment the index before passing index
        // this is because next command is only ever available 
        // when we are actively scrolling throught history
        let state = get(terminalStateWritable);
        let commandIndex = state.commandIndex;

        // if we are at the 'beginning' of history, reset input to blank
        if (commandIndex != state.commandHistory.length - 1) {
            this.updateCommandIndex(commandIndex += 1);
        } else {
            return ''
        }

        let myCommand = state.commandHistory[commandIndex];

        return myCommand;
    }
}

export default TerminalEngine;