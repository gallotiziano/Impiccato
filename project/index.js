const http = require('http');
const fs = require('fs');
const { Pool } = require('pg');


const dictionary = fs.readFileSync('dictionary.txt', 'utf8').split('\n');

function chooseRandomWord() {
    return dictionary[Math.floor(Math.random() * dictionary.length)];
}

function initializeGame() {
    return {
        word: chooseRandomWord().toLowerCase(),
        guessedLetters: [],
        attemptsLeft: 7,
        gameOver: false
    };
}

function checkLetter(word, letter) {
    return word.includes(letter);
}

async function updateGameState(game, letter) {
    if (game.word.includes(letter)) {
        game.guessedLetters.push(letter);
    } else {
        game.attemptsLeft--;
    }
    if (game.attemptsLeft === 0 || game.word.split('').every(letter => game.guessedLetters.includes(letter))) {
        game.gameOver = true;
    }
}

let game;

const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        game = initializeGame();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(game));
    } else if (req.url.startsWith('/guess')) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const data = JSON.parse(body);
            await updateGameState(game, data.letter);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(game));
        });
    } else if (req.url === '/hall_of_fame') {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT * FROM hall_of_fame ORDER BY score DESC LIMIT 10');
            client.release();
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(result.rows));
        } catch (err) {
            console.error('Errore durante la query:', err);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});