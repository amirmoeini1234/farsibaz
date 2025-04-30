// List of all 32 Persian letters
const persianLetters = [
    'ا', 'ب', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ذ', 
    'ر', 'ز', 'ژ', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 
    'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ه', 'ی'
];

/**
 * Selects a random letter from the Persian alphabet list.
 * @param {string[]} letters - An array of Persian letters.
 * @returns {string} A randomly selected Persian letter.
 */
function getRandomPersianLetter(letters) {
    // Generate a random index between 0 and letters.length - 1
    const randomIndex = Math.floor(Math.random() * letters.length);
    // Return the letter at the random index
    return letters[randomIndex];
}

// --- Example Usage ---

// Get a random letter
const randomLetter = getRandomPersianLetter(persianLetters);

// Display the random letter in the console
console.log("Random Persian Letter:", randomLetter);

// You can call the function multiple times to get different random letters
console.log("Another random letter:", getRandomPersianLetter(persianLetters));
console.log("And another:", getRandomPersianLetter(persianLetters)); 