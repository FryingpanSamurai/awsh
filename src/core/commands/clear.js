export const clearCommand = {
    name: "clear",
    aliases: ["cls"],
    execute(args, options, context) {
        context.updateState(currentState => {
            return {
                ...currentState,
                messages: []
            }
        });
        return null;
    }
}