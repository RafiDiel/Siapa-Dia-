let facts = [];
let playerCount = 0;
let currentPlayer = 1;
const MAX_PLAYERS = 10; // Sesuai permintaan lo

// Utility function to show a screen and hide others
function showScreen(id) {
    document.querySelectorAll('#app > div').forEach(div => {
        div.classList.add('hidden');
    });
    document.getElementById(id).classList.remove('hidden');
}

function startGame() {
    facts = [];
    currentPlayer = 1;
    // Tanyakan jumlah pemain saat game dimulai
    let num = prompt("Masukkan Jumlah Pemain (min 2, max 10):", "4");
    playerCount = parseInt(num);

    if (isNaN(playerCount) || playerCount < 2 || playerCount > MAX_PLAYERS) {
        alert(`Jumlah pemain harus antara 2 sampai ${MAX_PLAYERS}!`);
        return;
    }

    document.getElementById('player-status').innerText = `Pemain ke-${currentPlayer} dari ${playerCount}`;
    document.getElementById('fact-input').value = '';
    showScreen('input-screen');
}

function submitFact() {
    const fact = document.getElementById('fact-input').value.trim();
    
    if (fact.length < 10) {
        alert("Fakta harus diisi, minimal 10 karakter!");
        return;
    }

    // Simpan fakta dan ID pemilik (currentPlayer)
    facts.push({ id: currentPlayer, fact: fact });
    
    // Pindah ke pemain berikutnya
    currentPlayer++;

    if (currentPlayer > playerCount) {
        // Semua pemain sudah mengisi, saatnya Reveal
        showRevealScreen();
    } else {
        // Lanjut ke pemain berikutnya
        document.getElementById('player-status').innerText = `Pemain ke-${currentPlayer} dari ${playerCount}`;
        document.getElementById('fact-input').value = '';
        alert(`Fakta pemain ke-${currentPlayer - 1} sudah disimpan. Ganti HP ke pemain ke-${currentPlayer}!`);
    }
}

function showRevealScreen() {
    showScreen('reveal-screen');
    
    // Ambil fakta acak dari array
    const randomIndex = Math.floor(Math.random() * facts.length);
    const chosenFact = facts[randomIndex];
    
    // Ganti kata ganti "Dia" di awal fakta (biar lebih proper)
    let displayFact = chosenFact.fact.replace(/^(Dia)/i, '***');

    document.getElementById('revealed-fact').innerHTML = displayFact;
    
    // Simpan fakta terpilih agar bisa ditampilkan pemiliknya nanti
    document.getElementById('revealed-fact').dataset.ownerId = chosenFact.id;

    // Mulai Timer 5 detik
    let timer = 5;
    const timerDisplay = document.getElementById('timer-display');
    const nextBtn = document.getElementById('next-btn');
    
    timerDisplay.innerText = timer;
    nextBtn.classList.add('hidden'); // Sembunyikan tombol 'Siapa Pemiliknya?' dulu

    const countdown = setInterval(() => {
        timer--;
        timerDisplay.innerText = timer;

        if (timer <= 0) {
            clearInterval(countdown);
            timerDisplay.innerText = "Tunjuk! Tunjuk! Tunjuk!";
            nextBtn.classList.remove('hidden'); // Tampilkan tombol setelah waktu menunjuk habis
        }
    }, 1000);
}

function revealOwner() {
    showScreen('owner-screen');
    const ownerId = document.getElementById('revealed-fact').dataset.ownerId;
    
    // Tampilkan informasi pemilik fakta yang tersembunyi
    document.getElementById('fact-owner').innerText = `Pemilik fakta ini adalah... Pemain ke-${ownerId} !`;
    
    // Disini Momen Interaksi: Pemilik (Pemain ke-X) harus mengakui dan bercerita.
}

function resetGame() {
    showScreen('start-screen');
}

// Inisialisasi tampilan saat pertama kali load
showScreen('start-screen');