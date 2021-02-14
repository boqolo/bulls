/**
 * Constructs a valid 4 digit answer for the game (excluding 0).
 * @returns a 4-tuple of unique digits
 */
export function create4Digits() {
    const digits = Array.from([0, 0, 0, 0], () => Math.floor(Math.random() * 10));
    const uniqDigits = new Set(digits);
    if (uniqDigits.size !== 4 || digits.some((n) => n == 0)) {
        return create4Digits();
    }
    return Array.from(uniqDigits);
}

/**
 * Return 4-tuple of True/False representing accuracy of the guess compared to
 * the correct answer.
 * @param guess 4-tuple of unique digits (array)
 * @param answer 4-tuple of unique digits (array)
 * @returns Size 4 array of True/False
 */
export function getGuessAccuracy(guess, answer) {
    return guess.map((e, i) => {
        return guess[i] === answer[i];
    });
}

/**
 * Check if all values in 4-tuple (arr) are True.
 * @param guessAccuracy 4-tuple of True/False representing guess accuracy
 * @returns True only if all items are True
 */
export function isGuessCorrect(guessAccuracy) {
    return guessAccuracy.every((e) => {
        return e;
    });
}

/**
 * Checks if a guess is already represented in the guess history.
 * @param guess 4-tuple of unique digits (array)
 * @param guessHistory Array of [guess, numCorrectDigits, numCorrectPlacement]
 * @returns True if the guess has already been made
 */
export function isDuplicateGuess(guess, guessHistory) {
    const isEqualToGuess = (archivedGuess) => {
        return archivedGuess[0].every((e, i) => {
            return e === guess[i];
        });
    };
    return guessHistory.some(isEqualToGuess);
}

/**
 * Get the number of Bulls in the guess (number of digits in the correct place).
 * @param guessAccuracy 4-tuple of True/False representing guess accuracy
 * @returns Number representing how many correctly placed digits
 */
export function getBulls(guessAccuracy) {
    return guessAccuracy.reduce((acc, e) => {
        return e ? acc + 1 : acc;
    }, 0);
}

/**
 * Get the number of Cows in the guess (number of common digits between guess
 * and answer).
 * @param guess 4-tuple of unique digits (array)
 * @param answer 4-tuple of unique digits (array)
 * @returns Number representing how many correct digits in guess
 */
export function getCows(guess, answer) {
    return guess.reduce((acc, e) => {
        return answer.includes(e) ? acc + 1 : acc;
    }, 0);
}

/**
 * Checks if the change in the Input field initiated by key press is valid
 * (i.e. key pressed is a digit 0-9, the digit is unique, doesn't exceed
 * 4 digits, or is deleting a character).
 * @param currInputValue the current value of the input field
 * @param newInputValue the new value of the input field based on key press
 * @param keyPressed the key pressed
 * @returns True if key press is valid
 */
export function isValidInput(currInputValue, newInputValue, keyPressed) {
    const validKeys = "1234567890";
    return newInputValue.length < currInputValue.length ||
        (currInputValue.length < newInputValue.length &&
            !currInputValue.includes(keyPressed)
            && validKeys.includes(keyPressed));
}
