export const pwdCommand = {
    name: "pwd",
    aliases: [],
    execute(args, options, context) {
        return context.state.currentDirectory;
    }
}