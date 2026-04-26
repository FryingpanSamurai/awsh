export const clearCommand = {
    name: "clear",
    execute(args, context) {
        context.updateState.set('messages', [{}]);
    }
}