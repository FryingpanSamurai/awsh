<script>
    import { preventDefault } from "svelte/legacy";

    let messages = $state(["Welcome to arbiz' web shell."]);
    let inputText = $state("");
    let output = $state("");
    let terminal;

    function submitTerminalRequest(e) {
        if (inputText == "ls") {
            output = "file1.txt 001.csv cool_script.js";
        } else if (inputText == "clear") {
            messages = [];
            output = "";
        } else {
            output = `${inputText} is not a recognized command`;
        }

        messages = [...messages, `$> ${inputText}`, output];
        // after user executes a command, clear the input and output
        inputText = "";
        output = "";
    }

    function focusTerminal() {
        terminal.focus();
    }
</script>

<div
    id="main-container"
    class="page-container"
    onclick={() => focusTerminal()}
>
    {#each messages as msg}
        <div>{msg}</div>
    {/each}
    <form onsubmit={submitTerminalRequest} preventDefault>
        $> <input
            bind:this={terminal}
            class="cli-input"
            bind:value={inputText}
            autofocus
        />
    </form>
    {output}
</div>

<style>
    .page-container {
        background-color: black;
        width: 100vw;
        height: 100vh;
        color: lightgray;
        font-size: x-large;
    }

    .cli-input {
        background-color: black;
        color: lightgray;
        border: none;
        font-size: x-large;
    }

    .cli-input:focus-visible {
        border: none;
        outline: none;
    }
</style>
