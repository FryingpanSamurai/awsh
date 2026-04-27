export const pwdCommand = {
    name: "pwd",
    execute(args, options, context) {
        return context.state.currentDirectory;
    }
}