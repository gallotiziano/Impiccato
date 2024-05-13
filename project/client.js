let game;

function initializeGame() {
    fetch('/')
        .then(response => response.json())
        .then(data => {
            game = data;
            updateUI();
        });
}

function updateUI() {
    document.getElementById('word').textContent = game.word.replace(/\w/g, letter => game.guessedLetters.includes(letter) ? letter : '_');
    document.getElementById('attempts').textContent = `Tentativi rimasti: ${game.attemptsLeft}`;
}

function guessLetter() {
    const letter = document.getElementById('guess').value.toLowerCase();
    fetch('/guess', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ letter })
    })
    .then(response => response.json())
    .then(data => {
        game = data;
        updateUI();
        if (game.gameOver) {
            alert('Fine della partita!');
        }
    });
}

window.onload = initializeGame;