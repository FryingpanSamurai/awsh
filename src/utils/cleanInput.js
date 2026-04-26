// some helper functions

// clean the user input of whitespace and newline
export function cleanInput(inputText) {
    // trim whitespace from both ends
    let inputCleaned = inputText.trim();

    // remove newline using regex
    inputCleaned = inputCleaned.replace(/\n/, "");

    return inputCleaned;
}