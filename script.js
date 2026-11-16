// Hangman game logic
const MAX_WRONG_GUESSES = 6;

const wordForm = document.getElementById("word-form");
const wordInput = document.getElementById("word-input");
const startButton = document.getElementById("start-button");
const guessForm = document.getElementById("guess-form");
const guessInput = document.getElementById("guess-input");
const guessButton = document.getElementById("guess-button");
const wordDisplay = document.getElementById("word-display");
const remainingDisplay = document.getElementById("remaining-guesses");
const guessedDisplay = document.getElementById("guessed-letters");
const messageArea = document.getElementById("guesses-area");
const gameMessage = document.getElementById("game-message");
const newGameButton = document.getElementById("new-game-button");
const hangmanParts = [
  document.getElementById("head"),
  document.getElementById("body"),
  document.getElementById("left-arm"),
  document.getElementById("right-arm"),
  document.getElementById("left-leg"),
  document.getElementById("right-leg")
];

let secretWord = "";
let guessedLetters = [];
let wrongGuesses = 0;
let gameFinished = true;

// Start a round only after a valid secret word has been entered.
wordForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const chosenWord = wordInput.value.trim().toUpperCase();

  if (!/^[A-Z]+$/.test(chosenWord)) {
    showMessage("Please choose a word using letters A–Z only.");
    wordInput.focus();
    return;
  }

  startGame(chosenWord);
});

function startGame(word) {
  secretWord = word;
  guessedLetters = [];
  wrongGuesses = 0;
  gameFinished = false;
  updateHangman();

  wordInput.value = "";
  wordInput.disabled = true;
  startButton.disabled = true;
  guessInput.disabled = false;
  guessButton.disabled = false;
  guessInput.value = "";

  messageArea.className = "guesses-area";
  showMessage("Game started. Enter a letter to make your first guess.");
  updateDisplay();
  guessInput.focus();
}

// Check a guess and update the game.
guessForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Do not accept guesses before a word is selected or after the game ends.
  if (!secretWord || gameFinished) {
    return;
  }

  const letter = guessInput.value.trim().toUpperCase();

  // Clear the input after every submitted guess.
  guessInput.value = "";

  if (!/^[A-Z]$/.test(letter)) {
    showMessage("Enter one letter from A to Z.");
    guessInput.focus();
    return;
  }

  // Prevent the same letter from being guessed more than once.
  if (guessedLetters.includes(letter)) {
    showMessage(`You already guessed "${letter}". Try a different letter.`);
    guessInput.focus();
    return;
  }

  guessedLetters.push(letter);

  if (!secretWord.includes(letter)) {
    wrongGuesses++;
    showMessage(`"${letter}" is not in the word.`);
  } else {
    showMessage(`Good guess! "${letter}" is in the word.`);
  }

  updateDisplay();
  checkGameStatus();

  if (!gameFinished) {
    guessInput.focus();
  }
});

// Refresh the word, guessed letters, and remaining guesses.
function updateDisplay() {
  if (!secretWord) {
    wordDisplay.textContent = "Choose a word to begin";
    remainingDisplay.textContent = MAX_WRONG_GUESSES;
    guessedDisplay.textContent = "None";
    return;
  }

  wordDisplay.textContent = secretWord
    .split("")
    .map(letter => guessedLetters.includes(letter) ? letter : "_")
    .join(" ");

  remainingDisplay.textContent = MAX_WRONG_GUESSES - wrongGuesses;
  updateHangman();
  guessedDisplay.textContent = guessedLetters.length
    ? guessedLetters.join(", ")
    : "None";
}

// Check for a win or loss and lock the game when it is finished.
// Show one additional part of the stick figure for each incorrect guess.
function updateHangman() {
  hangmanParts.forEach((part, index) => {
    part.style.visibility = index < wrongGuesses ? "visible" : "hidden";
  });
}

function checkGameStatus() {
  const playerWon = secretWord
    .split("")
    .every(letter => guessedLetters.includes(letter));

  if (playerWon) {
    finishGame(true);
  } else if (wrongGuesses >= MAX_WRONG_GUESSES) {
    finishGame(false);
  }
}

function finishGame(won) {
  gameFinished = true;
  guessInput.disabled = true;
  guessButton.disabled = true;

  if (won) {
    messageArea.className = "guesses-area win";
    showMessage(`You won! The word was "${secretWord}".`);
  } else {
    messageArea.className = "guesses-area loss";
    wordDisplay.textContent = secretWord.split("").join(" ");
    showMessage(`Game over! The word was "${secretWord}".`);
  }
}

// Put game feedback and win/loss dialogs in the guesses area.
function showMessage(message) {
  gameMessage.textContent = message;
}

// Reset the page so another word can be selected.
newGameButton.addEventListener("click", function () {
  secretWord = "";
  guessedLetters = [];
  wrongGuesses = 0;
  gameFinished = true;
  updateHangman();

  wordInput.disabled = false;
  startButton.disabled = false;
  guessInput.disabled = true;
  guessButton.disabled = true;
  wordInput.value = "";
  guessInput.value = "";

  messageArea.className = "guesses-area";
  showMessage("Select a word before making your first guess.");
  updateDisplay();
  wordInput.focus();
});

// Initial state: guessing is disabled until a word is chosen.
updateDisplay();
