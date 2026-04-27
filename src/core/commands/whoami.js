export const whoamiCommand = {
    name: "whoami",
    execute(args, options, context) {
        return context.user.name;
    }
}