const lettere = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
let parolaDaIndovinare = '';
let parolaMostrata = [];
let errori = 0;

const aggiornaImmagine = () => {
  const immagine = document.getElementById('immagine-impiccato');
  immagine.src = `sprite/impiccato${errori}.png`;
};

const inizializzaGioco = async () => {
  try {
    const response = await fetch('/parolaCasuale');
    const data = await response.json();
    parolaDaIndovinare = data.word.toUpperCase().trim();
    parolaMostrata = Array(parolaDaIndovinare.length).fill('_');
    errori = 0;
    aggiornaImmagine();
    mostraParola();
    mostraLettere();
  } catch (error) {
    console.error('Errore nel caricamento della parola:', error);
  }
};

const mostraParola = () => {
  const parolaDiv = document.getElementById('parola');
  parolaDiv.textContent = parolaMostrata.join(' ');
};

const mostraLettere = () => {
  const lettereDiv = document.getElementById('lettere');
  lettereDiv.innerHTML = '';
  lettere.forEach(lettera => {
    const button = document.createElement('button');
    button.textContent = lettera;
    button.className = 'lettera';
    button.addEventListener('click', () => scegliLettera(lettera, button));
    lettereDiv.appendChild(button);
  });
};

const scegliLettera = (lettera, button) => {
  if (parolaDaIndovinare.includes(lettera)) {
    parolaDaIndovinare.split('').forEach((char, index) => {
      if (char === lettera) {
        parolaMostrata[index] = lettera;
      }
    });
    button.className = 'lettera lettera-corretta';
  } else {
    errori++;
    aggiornaImmagine();
    button.className = 'lettera lettera-sbagliata';
  }
  mostraParola();
  verificaVittoria();
};

const verificaVittoria = () => {
  if (parolaMostrata.join('') === parolaDaIndovinare) {
    alert('Hai vinto!');
    inizializzaGioco();
  } else if (errori >= 6) {
    alert('Hai perso! La parola era: ' + parolaDaIndovinare);
    inizializzaGioco();
  }
};

window.onload = inizializzaGioco;
