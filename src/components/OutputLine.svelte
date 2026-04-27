<script>
    let { msg } = $props();
</script>

<div>
    {#if msg.type === 'error'}
        <span class="error-msg">{msg.content}</span>
    {:else}
        <span class="output-msg">{msg.content}</span>
    {/if}
</div>

<style>
    .output-msg {
        color: lightgray;
        font-family: 'Courier New', Courier, monospace;
        font-size: 12pt;
    }

    .error-msg {
        color: red;
        font-family: 'Courier New', Courier, monospace;
        font-size: 12pt;
    }
</style>