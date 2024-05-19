let word;
let guessedLetters = [];
let attemptsLeft = 7;

const impiccatoImage = document.getElementById('impiccato-image');
const wordDisplay = document.getElementById('word-display');
const lettersContainer = document.getElementById('letters-container');

async function loadWord() {
    const response = await fetch('/random-word');
    const data = await response.json();
    word = data.word.toLowerCase();
    guessedLetters = [];
    attemptsLeft = 7;
    updateUI();
}

function initializeUI() {
    for (let i = 97; i <= 122; i++) {
        const letter = String.fromCharCode(i);
        const button = document.createElement('button');
        button.innerText = letter.toUpperCase();
        button.classList.add('btn', 'btn-primary', 'mr-2', 'mb-2');
        button.addEventListener('click', () => guessLetter(letter));
        lettersContainer.appendChild(button);
    }
}

function updateUI() {
    impiccatoImage.src = `/images/impiccato${7 - attemptsLeft}.png`;
    wordDisplay.textContent = word
        .split('')
        .map(letter => guessedLetters.includes(letter) ? letter : '_')
        .join(' ');
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        const letter = button.innerText.toLowerCase();
        button.disabled = guessedLetters.includes(letter);
    });
}

function guessLetter(letter) {
    if (word.includes(letter)) {
        guessedLetters.push(letter);
    } else {
        attemptsLeft--;
    }
    updateUI();
    if (attemptsLeft === 0 || word.split('').every(letter => guessedLetters.includes(letter))) {
        setTimeout(() => {
            alert('Hai ' + (attemptsLeft > 0 ? 'Vinto!' : 'Perso!'));
            loadWord();
        }, 500);
    }
}

window.onload = () => {
    initializeUI();
    loadWord();
};
