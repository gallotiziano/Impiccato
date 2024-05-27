const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 5005;

let parole = [];

fs.readFile(path.join(__dirname, 'dizionario.txt'), 'utf8', (err, data) => {
  if (err) {
    console.error('Errore nel caricamento del dizionario:', err);
    return;
  }
  parole = data.split('\n').map(parola => parola.trim()).filter(parola => parola.length > 0);
  console.log('Dizionario caricato con successo');
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/sprite', express.static(path.join(__dirname, 'sprite')));

app.get('/parolaCasuale', (req, res) => {
  if (parole.length === 0) {
    return res.status(500).json({ error: 'Errore nel caricamento delle parole' });
  }
  const randomWord = parole[Math.floor(Math.random() * parole.length)];
  res.json({ word: randomWord });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});

