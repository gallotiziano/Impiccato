const http = require('http');
const fs = require('fs');
const path = require('path');

const dizionario = fs.readFileSync('dizionario.txt', 'utf8').split('\n');

function chooseRandomWord() {
    return dizionario[Math.floor(Math.random() * dizionario.length)].trim();
}

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (req.url === '/script.js') {
        fs.readFile('script.js', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading script.js');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
    } else if (req.url.startsWith('/images/')) {
        const imgPath = path.join(__dirname, req.url);
        fs.readFile(imgPath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Image not found');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.end(data);
        });
    } else if (req.url === '/random-word') {
        const word = chooseRandomWord();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ word }));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
