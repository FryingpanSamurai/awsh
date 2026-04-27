import { writable } from "svelte/store";

export const terminalStateWritable = writable({
    user: {
        name: "guest",
        role: "guest"
    },
    authenticated: false,
    messages: [],
    currentDirectory: "/",
    commandHistory: [],
    commandIndex: 0
});
