export const pwdCommand = {
    name: "pwd",
    execute(args, context) {
        return context.state.currentDirectory;
    }
}