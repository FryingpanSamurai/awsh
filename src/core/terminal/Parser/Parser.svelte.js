class Parser {
    constructor(rawInput) {
        this.rawInput = rawInput;
    }
    cleanInput() {
        // string whitespace
        this.cleanInput = this.rawInput.trim();

        // lets also remove newlines and maybe even tabs
        this.cleanInput = this.rawInput.replace(/\n/, '');
        this.cleanInput = this.rawInput.replace(/\t/, '');
    }
    parseCommand() {
        return this.rawInput.split(" ")[0]
    }
    parseCommandOptions() {
        let options = this.rawInput.matchAll(/-/);
        if (options != -1) {
            // logic here to extract the value from -xyz or -x -y -z depending on how the user inputs the options
        }
    }

}