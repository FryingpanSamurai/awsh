class Parser {
    constructor(rawInput) {
        this.rawInput = rawInput;
        this.cleanInput()
    }

    parse() {
        return {
            raw: this.rawInput,
            command: this.parseCommand(),
            args: this.parseArgs(),
            options: this.parseCommandOptions()
        }
    }

    cleanInput() {
        // string whitespace
        this.cleanedInput = this.rawInput.trim();

        // lets also remove newlines and maybe even tabs
        this.cleanedInput = this.cleanedInput.replace(/\n/, '');
        this.cleanedInput = this.cleanedInput.replace(/\t/, '');
    }

    parseCommand() {
        return this.cleanedInput.split(" ")[0]
    }

    parseArgs() {
        // find the first space and then parse the args from the options/flags
        let spaceIndex = this.rawInput.indexOf(" ");
        if (spaceIndex != -1) {
            let args = this.cleanedInput.substr(this.rawInput.indexOf(" ") + 1).split(" ");

            args = args.filter((a) => {
                return !a.startsWith('-')
            });
            return args;
        } else {
            return null;
        }
    }

    parseCommandOptions() {
        // ok so we need to first see how many options the user may have passed
        // some terminals allow multiple dashes to be passed each passing an option
        // e.g. ls -l -s 

        // others allow just one dash with the various options passed concurrently
        // e.g. ls -ls 
        // let's account for both

        // so we'll first need to know how many options, 
        // if any, the user passed in the arguments
        // but we need to validate args first
        let options = this.cleanedInput.match(/-/);

        if (options) {
            // first lets collect the options (they start with a dash)
            let optionsArr = this.cleanedInput.split(" ").filter((a) => {
                return a.startsWith('-')
            });

            // we'll have two distinct option arrays here:
            // - dash with single character
            // - dash with multiple characters
            // account for both by splitting atomically
            let optionsCharacters = new Set();

            // nested functions that splits the options into characters
            // then parses the options from other options and the dash
            optionsArr.forEach(e => {
                e.split("").forEach(c => {
                    c === '-' ? "" : optionsCharacters.add(c);
                })
            });

            return optionsCharacters
        } else {
            return null;
        }
    }

}

export default Parser;