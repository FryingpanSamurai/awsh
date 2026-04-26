<script>
    let { msg } = $props();
</script>

<div class="output-msg">{msg.content}</div>

<style>
    .output-msg {
        color: lightgray;
        font-family: 'Courier New', Courier, monospace;
        font-size: 12pt;
    }
</style>