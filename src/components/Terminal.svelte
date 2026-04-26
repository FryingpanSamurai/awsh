<script>
    import OutputLine from "./OutputLine.svelte";
    import TerminalEngine from "../core/terminal/TerminalEngine/TerminalEngine.svelte";

    import { onMount } from "svelte";
    import { terminalStateWritable } from "../state/TerminalStore.svelte";

    let myTerminal;
    let inputText = $state('');

    onMount(() => {
        // instantiate the terminal engine 
        myTerminal = new TerminalEngine();
    });

    // so we broke out the input string to prevent DOM crawl into the engine
    // before I was only calling the TerminalEngine
    function executeCommand (e) {
        e.preventDefault();
        myTerminal.execute(inputText);
        inputText = '';
    }

</script>

{#each $terminalStateWritable.messages as msg}
    <OutputLine {msg} />
{/each}

<div class="terminal-wrapper">awsh$&nbsp;
    <div 
        onkeydown={(e) => (e.key === 'Enter' ? executeCommand(e) : "")}
        bind:innerText={inputText}
        class="input-line" 
        contenteditable="true"
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
        color: white;
        width: 100%;
        height: 100%;
        background-color: black;
    }
</style>