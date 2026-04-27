<script>
    import OutputLine from "./OutputLine.svelte";
    import TerminalEngine from "../core/terminal/TerminalEngine/TerminalEngine.svelte";

    import { onMount } from "svelte";
    import { terminalStateWritable } from "../state/TerminalStore.svelte";
    import { command } from "$app/server";
    import { get } from "svelte/store";

    let myTerminal;
    let inputText = $state('');

    onMount(() => {
        // instantiate the terminal engine 
        myTerminal = new TerminalEngine();
    });

    // main function for the terminal to execute the command
    function executeCommand (e) {
        e.preventDefault();
        myTerminal.execute(inputText);
        inputText = '';
    }

    // this would be passed to TerminalEngine but- 
    // because, uparrow and downarrow will scroll I need preventDefault
    function fetchPriorCommand(e) {
        e.preventDefault();
        inputText = myTerminal.fetchPriorCommand();
    }

    function fetchNextCommand(e) {
        e.preventDefault();
        inputText = myTerminal.fetchNextCommand();
    }

    function resetCommandIndex() {
        myTerminal.updateCommandIndex($terminalStateWritable.commandHistory.length - 1);
    }
</script>

{#each $terminalStateWritable.messages as msg}
    <OutputLine {msg} />
{/each}

<div class="terminal-wrapper">
    <span class="prompt">{$terminalStateWritable.user.name}@awsh {$terminalStateWritable.currentDirectory}<strong>$</strong>&nbsp;</span>
    <div 
        onkeydown={(e) => (e.key === 'Enter' ? executeCommand(e) : e.key === 'ArrowUp' ? fetchPriorCommand(e) : e.key === 'ArrowDown' ? fetchNextCommand(e) : resetCommandIndex(e))}
        bind:innerText={inputText}
        class="input-line" 
        contenteditable="true"
        id="terminal"
        role=input>
    </div>
</div>

<style>
    .input-line {
        background-color: black;
        color: lightgray;
        border: none;
        font-size: 12pt;
        font-family: 'Courier New', Courier, monospace;
        width: 100vw;
        height: 100vh;
    }

    .input-line:focus-visible {
        border: none;
        outline: none;
    }

    .terminal-wrapper {
        display: flex;
        width: 100%;
        height: 100%;
        background-color: black;
    }

    .prompt {
        text-wrap: nowrap;
        font-family: 'Courier New', Courier, monospace;
        color: white;
    }
</style>