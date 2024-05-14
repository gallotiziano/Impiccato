let game;
let hangmanImage = document.getElementById('hangman-image');

function initializeGame() {
}

function updateUI() {
}

function guessLetter() {
    if (tentativoErrato) {
        let imgNumero = 7 - game.tentativiRimasti; 
        hangmanImage.src = `hangman${imgNumero}.png`;
    }
}

window.onload = initializeGame;