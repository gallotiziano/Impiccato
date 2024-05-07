const http = require('http');
const fs = require('fs');

const dizionario = fs.readFileSync('dizionario.txt', 'utf8').split('\n');

function scegliParolaCasuale() {
    return dizionario[Math.floor(Math.random() * dizionario.length)];
}

function inizializzaPartita() {
    return {
        parola: scegliParolaCasuale().toLowerCase(),
        lettereIndovinate: [],
        tentativiRimasti: 7,
        finePartita: false
    };
}

function controllaLettera(parola, lettera) {
    return parola.includes(lettera);
}

function aggiornaStatoPartita(partita, lettera) {
    if (partita.parola.includes(lettera)) {
        partita.lettereIndovinate.push(lettera);
    } else {
        partita.tentativiRimasti--;
    }
    if (partita.tentativiRimasti === 0 || partita.parola.split('').every(lettera => partita.lettereIndovinate.includes(lettera))) {
        partita.finePartita = true;
    }
}

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        const partita = inizializzaPartita();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(partita));
    } else if (req.url.startsWith('/indovina')) {
        let corpo = '';
        req.on('data', pezzo => {
            corpo += pezzo.toString();
        });
        req.on('end', () => {
            const dati = JSON.parse(corpo);
            aggiornaStatoPartita(partita, dati.lettera);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(partita));
        });
    } else {
        res.writeHead(404);
        res.end('Non trovato');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});