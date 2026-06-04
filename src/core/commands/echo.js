export const echo = {
    name: "echo",
    aliases: [],
    execute(args, context) {
        // concatenate the args with spaces
        return args.join(' ');
    }
}