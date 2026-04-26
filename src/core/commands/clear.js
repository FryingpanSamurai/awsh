export const clearCommand = {
    name: "clear",
    execute(args, context) {
        context.updateState(currentState => {
            return {
                ...currentState,
                messages: []
            }
        });
        return null;
    }
}