import { writable } from "svelte/store";

export const terminalStateWritable = writable({
    user: "default",
    messages: [],
    currentDirectory: "/"
});
