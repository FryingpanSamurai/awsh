export const clearCommand = {
    name: "clear",
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