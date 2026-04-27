export const whoamiCommand = {
    name: "whoami",
    aliases: [],
    execute(args, options, context) {
        return context.user.name;
    }
}