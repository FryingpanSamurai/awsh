<script>
    import Terminal from "../components/Terminal.svelte";
</script>

<div class="page-container" onclick={() => terminal.focus()}>
    <Terminal />
</div>

<style>
    .page-container {
        height: 100%;
        width: 100%;
        background-color: black;
    }
</style>
