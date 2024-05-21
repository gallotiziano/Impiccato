const express = require('express');
const https = require('https');
const app = express();
const port = 5005;

const loadWords = () => {
  return new Promise((resolve, reject) => {
    https.get('https://github.com/napolux/paroleitaliane/blob/master/paroleitaliane/60000_parole_italiane.txt', (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        resolve(data.split('\n'));
      });

    }).on("error", (err) => {
      reject(err);
    });
  });
};

app.get('/parolaCasuale', async (req, res) => {
  try {
    const words = await loadWords();
    if (words.length === 0) {
      return res.status(500).json({ error: 'Errore nel caricamento delle parole' });
    }
    const randomWord = words[Math.floor(Math.random() * words.length)];
    res.json({ word: randomWord.trim() });
  } catch (error) {
    console.error('Errore nel caricamento delle parole:', error);
    res.status(500).json({ error: 'Errore nel caricamento delle parole' });
  }
});

app.listen(port, () => {
  console.log(`Server in ascolto sulla porta' ${port}`);
});