let partita;

function inizializzaPartita() {
    fetch('/')
        .then(response => response.json())
        .then(data => {
            partita = data;
            aggiornaInterfaccia();
        });
}

function aggiornaInterfaccia() {
    document.getElementById('parola').textContent = partita.parola.replace(/\w/g, lettera => partita.lettereIndovinate.includes(lettera) ? lettera : '_');
    document.getElementById('tentativi').textContent = `Tentativi rimasti: ${partita.tentativiRimasti}`;
}

function indovinaLettera() {
    const lettera = document.getElementById('indovina').value.toLowerCase();
    fetch('/indovina', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lettera })
    })
    .then(response => response.json())
    .then(data => {
        partita = data;
        aggiornaInterfaccia();
        if (partita.finePartita) {
            alert('Fine della partita!');
        }
    });
}

window.onload = inizializzaPartita;