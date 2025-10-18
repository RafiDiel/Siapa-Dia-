let facts = [];
let unplayedFactIndices = []; // Array untuk menyimpan indeks fakta yang belum dimainkan
let playerCount = 0;
let currentPlayer = 1;
const MAX_PLAYERS = 10;

// Utility function to show a screen and hide others
function showScreen(id) {
    document.querySelectorAll('#app > div').forEach(div => {
        div.classList.add('hidden');
    });
    document.getElementById(id).classList.remove('hidden');
}

function startGame() {
    facts = [];
    unplayedFactIndices = [];
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

    // Simpan fakta dan ID pemilik
    facts.push({ id: currentPlayer, fact: fact, played: false });
    
    // Pindah ke pemain berikutnya
    currentPlayer++;

    if (currentPlayer > playerCount) {
        // Semua pemain sudah mengisi, inisialisasi indeks fakta yang belum dimainkan
        unplayedFactIndices = Array.from({ length: facts.length }, (_, i) => i);
        showRevealScreen();
    } else {
        // Lanjut ke pemain berikutnya
        document.getElementById('player-status').innerText = `Pemain ke-${currentPlayer} dari ${playerCount}`;
        document.getElementById('fact-input').value = '';
        alert(`Fakta pemain ke-${currentPlayer - 1} sudah disimpan. Ganti HP ke pemain ke-${currentPlayer}!`);
    }
}

function showRevealScreen() {
    // Cek apakah semua fakta sudah dimainkan
    if (unplayedFactIndices.length === 0) {
        alert("Wih! Semua fakta sudah terbongkar! Game selesai, saatnya bikin rahasia baru.");
        return resetGame(); // Kembali ke layar awal
    }

    showScreen('reveal-screen');
    
    // 3. Ambil fakta secara acak dari yang BELUM dimainkan
    const randomIdxIndex = Math.floor(Math.random() * unplayedFactIndices.length);
    const factIndex = unplayedFactIndices[randomIdxIndex];
    const chosenFact = facts[factIndex];
    
    // Tampilkan fakta
    let displayFact = chosenFact.fact.replace(/^(Dia)/i, '***');
    document.getElementById('revealed-fact').innerHTML = displayFact;
    
    // Simpan INDEX fakta yang dipilih (bukan ID pemilik)
    document.getElementById('revealed-fact').dataset.factIndex = factIndex;
    
    // Hapus indeks fakta ini dari array unplayedFactIndices (agar tidak muncul lagi)
    unplayedFactIndices.splice(randomIdxIndex, 1);
}

// 1. Fungsi yang dipanggil ketika tombol 'Siap Menunjuk!' ditekan
function startPointingTimer() {
    showScreen('pointing-screen');

    // 2. Mulai Timer 5 detik untuk Menunjuk
    let timer = 5;
    const timerDisplay = document.getElementById('pointing-timer-display');
    const showOwnerBtn = document.getElementById('show-owner-btn');
    
    timerDisplay.innerText = timer;
    showOwnerBtn.classList.add('hidden'); 

    const countdown = setInterval(() => {
        timer--;
        timerDisplay.innerText = timer;

        if (timer <= 0) {
            clearInterval(countdown);
            timerDisplay.innerText = "WAKTUNYA BUKTIKAN!";
            showOwnerBtn.classList.remove('hidden'); // Tampilkan tombol untuk ke layar pengakuan
        }
    }, 1000);
}

function revealOwner() {
    showScreen('owner-screen');
    const factIndex = document.getElementById('revealed-fact').dataset.factIndex;
    const ownerId = facts[factIndex].id;
    
    // Tampilkan informasi pemilik fakta
    document.getElementById('fact-owner').innerText = `Pemilik fakta ini adalah... Pemain ke-${ownerId} !`;
    
    // Cek apakah masih ada fakta tersisa untuk mengubah teks tombol
    if (unplayedFactIndices.length > 0) {
         document.getElementById('next-fact-btn').innerText = `Lanjut ke ${facts.length - unplayedFactIndices.length + 1} / ${facts.length} Fakta Berikutnya`;
    } else {
        document.getElementById('next-fact-btn').innerText = "Semua Fakta Selesai! Main Lagi dari Awal";
    }
}

// 3. Tombol untuk lanjut ke Fakta berikutnya
function nextFact() {
    if (unplayedFactIndices.length > 0) {
        showRevealScreen();
    } else {
        // Jika sudah habis, kembali ke layar awal
        resetGame();
    }
}

function resetGame() {
    showScreen('start-screen');
}

// Inisialisasi tampilan saat pertama kali load
showScreen('start-screen');