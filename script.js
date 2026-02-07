// Pokemon Data (ID matches PokeAPI for potential future use)
const POKEMON_DATA = [
    { id: 25, name: 'Pikachu', color: '#feca1b', type: 'normal', power: 60 },
    { id: 1, name: 'Bulbasaur', color: '#78c850', type: 'grass', power: 50 },
    { id: 4, name: 'Charmander', color: '#f08030', type: 'fire', power: 50 },
    { id: 7, name: 'Squirtle', color: '#6890f0', type: 'water', power: 50 },
    { id: 94, name: 'Gengar', color: '#705898', type: 'normal', power: 70 },
    { id: 133, name: 'Eevee', color: '#a8a878', type: 'normal', power: 40 },
    { id: 54, name: 'Psyduck', color: '#f8d030', type: 'water', power: 45 },
    { id: 150, name: 'Mewtwo', color: '#c6c6a7', type: 'normal', power: 90 },
    { id: 6, name: 'Charizard', color: '#f08030', type: 'fire', power: 85 },
    { id: 9, name: 'Blastoise', color: '#6890f0', type: 'water', power: 80 },
    { id: 3, name: 'Venusaur', color: '#78c850', type: 'grass', power: 80 },
    { id: 39, name: 'Jigglypuff', color: '#f0a0a0', type: 'normal', power: 35 },
    { id: 143, name: 'Snorlax', color: '#444060', type: 'normal', power: 75 },
    { id: 37, name: 'Vulpix', color: '#f08030', type: 'fire', power: 45 },
    { id: 131, name: 'Lapras', color: '#6890f0', type: 'water', power: 75 },
    { id: 152, name: 'Chikorita', color: '#78c850', type: 'grass', power: 40 },
    { id: 155, name: 'Cyndaquil', color: '#f08030', type: 'fire', power: 45 },
    { id: 158, name: 'Totodile', color: '#6890f0', type: 'water', power: 45 },
    { id: 470, name: 'Leafeon', color: '#78c850', type: 'grass', power: 60 },
    { id: 52, name: 'Meowth', color: '#f0d0a0', type: 'normal', power: 40 },
    { id: 135, name: 'Jolteon', color: '#f8d030', type: 'normal', power: 65 },
    { id: 134, name: 'Vaporeon', color: '#6890f0', type: 'water', power: 65 },
    { id: 136, name: 'Flareon', color: '#f08030', type: 'fire', power: 65 },
];

// ===========================
// BATTLE POKEMON DATA (HP Battle Mode)
// ===========================

const BATTLE_POKEMON = [
    // Fire (4)
    { id: 4, name: 'Charmander', type: 'fire', hp: 20, attackName: 'Ember', baseDamage: 6 },
    { id: 6, name: 'Charizard', type: 'fire', hp: 28, attackName: 'Flamethrower', baseDamage: 6 },
    { id: 37, name: 'Vulpix', type: 'fire', hp: 18, attackName: 'Fire Spin', baseDamage: 7 },
    { id: 136, name: 'Flareon', type: 'fire', hp: 25, attackName: 'Fire Blast', baseDamage: 5 },
    // Water (4)
    { id: 7, name: 'Squirtle', type: 'water', hp: 22, attackName: 'Water Gun', baseDamage: 6 },
    { id: 9, name: 'Blastoise', type: 'water', hp: 28, attackName: 'Hydro Cannon', baseDamage: 6 },
    { id: 54, name: 'Psyduck', type: 'water', hp: 20, attackName: 'Aqua Tail', baseDamage: 7 },
    { id: 131, name: 'Lapras', type: 'water', hp: 28, attackName: 'Surf', baseDamage: 5 },
    // Grass (3)
    { id: 1, name: 'Bulbasaur', type: 'grass', hp: 22, attackName: 'Vine Whip', baseDamage: 6 },
    { id: 3, name: 'Venusaur', type: 'grass', hp: 26, attackName: 'Solar Beam', baseDamage: 6 },
    { id: 470, name: 'Leafeon', type: 'grass', hp: 25, attackName: 'Leaf Blade', baseDamage: 6 },
    // Normal (5) — fan favorites
    { id: 25, name: 'Pikachu', type: 'normal', hp: 20, attackName: 'Thunder', baseDamage: 6 },
    { id: 149, name: 'Dragonite', type: 'normal', hp: 35, attackName: 'Dragon Claw', baseDamage: 10 },
    { id: 150, name: 'Mewtwo', type: 'normal', hp: 32, attackName: 'Psychic', baseDamage: 11 },
    { id: 94, name: 'Gengar', type: 'normal', hp: 18, attackName: 'Shadow Ball', baseDamage: 7 },
    { id: 143, name: 'Snorlax', type: 'normal', hp: 30, attackName: 'Body Slam', baseDamage: 5 },
];

// All 16 unlocked from the start
const UNLOCK_ORDER = BATTLE_POKEMON.map(p => p.id);

// Type system constants
const TYPE_BONUS = 25;
const TYPE_CHART = {
    fire: { beats: 'grass', losesTo: 'water' },
    water: { beats: 'fire', losesTo: 'grass' },
    grass: { beats: 'water', losesTo: 'fire' },
    normal: { beats: null, losesTo: null },
};
const TYPE_COLORS = {
    fire: '#f08030',
    water: '#6890f0',
    grass: '#78c850',
    normal: '#a8a878',
};

function getTypeMultiplier(attackerType, defenderType) {
    const chart = TYPE_CHART[attackerType];
    if (!chart) return 1;
    if (chart.beats === defenderType) return 2;
    if (chart.losesTo === defenderType) return 0.5;
    return 1;
}

// Audio Controller (Synthesized Sound)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

// Haptic Feedback
function vibrate(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
}

function playFlipSound() { playTone(300, 'sine', 0.1); vibrate(15); }
function playMatchSound() {
    playTone(600, 'triangle', 0.1);
    setTimeout(() => playTone(800, 'triangle', 0.2), 100);
    vibrate([30, 50, 30]);
}

function playVictoryFanfare() {
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 'square', 0.3), i * 150);
    });
    setTimeout(() => {
        playTone(261.63, 'triangle', 1.0);
        playTone(329.63, 'triangle', 1.0);
        playTone(392.00, 'triangle', 1.0);
    }, 600);
}

function playBattleClash() {
    // Dramatic rumble buildup
    playTone(80, 'sawtooth', 0.4);
    playTone(90, 'sawtooth', 0.4);
    setTimeout(() => {
        playTone(100, 'sawtooth', 0.3);
        playTone(120, 'sawtooth', 0.3);
    }, 200);
    // Big impact hit
    setTimeout(() => {
        playTone(60, 'square', 0.5);
        playTone(180, 'sawtooth', 0.3);
        playTone(350, 'square', 0.15);
    }, 500);
    vibrate([30, 20, 30, 20, 40, 20, 100]);
}

function playWinnerSting() {
    playTone(523.25, 'square', 0.15);
    setTimeout(() => playTone(659.25, 'square', 0.15), 120);
    setTimeout(() => playTone(783.99, 'square', 0.3), 240);
    vibrate([40, 30, 60]);
}

function playTieSting() {
    playTone(350, 'triangle', 0.2);
    setTimeout(() => playTone(350, 'triangle', 0.3), 200);
    vibrate([30, 50, 30]);
}

// HP Battle Sounds
function playAttackSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    switch (type) {
        case 'fire':
            playTone(200, 'sawtooth', 0.15);
            setTimeout(() => playTone(400, 'sawtooth', 0.2), 80);
            setTimeout(() => playTone(600, 'sawtooth', 0.1), 160);
            break;
        case 'water':
            playTone(300, 'sine', 0.2);
            setTimeout(() => playTone(500, 'sine', 0.15), 100);
            setTimeout(() => playTone(250, 'sine', 0.2), 200);
            break;
        case 'grass':
            playTone(350, 'triangle', 0.1);
            setTimeout(() => playTone(450, 'triangle', 0.1), 60);
            setTimeout(() => playTone(550, 'triangle', 0.15), 120);
            break;
        default:
            playTone(250, 'square', 0.15);
            setTimeout(() => playTone(350, 'square', 0.15), 100);
            break;
    }
    vibrate([30, 20, 40]);
}

function playSuperEffectiveSound() {
    playTone(400, 'square', 0.1);
    setTimeout(() => playTone(600, 'square', 0.1), 80);
    setTimeout(() => playTone(800, 'square', 0.2), 160);
    setTimeout(() => playTone(1000, 'square', 0.3), 250);
    vibrate([40, 20, 40, 20, 80]);
}

function playFaintSound() {
    playTone(400, 'triangle', 0.2);
    setTimeout(() => playTone(300, 'triangle', 0.2), 150);
    setTimeout(() => playTone(200, 'triangle', 0.3), 300);
    setTimeout(() => playTone(100, 'triangle', 0.4), 450);
    vibrate([60, 40, 80]);
}

// Custom Audio for Damian
function speakVictoryMessage() {
    const audio = new Audio('Good Job Damian.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
}

// Confetti System
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confettiParticles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createConfetti() {
    const colors = ['#feca1b', '#3b4cca', '#ff0000', '#ffffff', '#4CAF50'];
    for (let i = 0; i < 150; i++) {
        confettiParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            speedY: Math.random() * 5 + 3,
            speedX: Math.random() * 4 - 2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }
    requestAnimationFrame(updateConfetti);
}

function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (confettiParticles.length === 0) return;

    confettiParticles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
    });

    confettiParticles = confettiParticles.filter(p => p.y <= canvas.height);

    if (confettiParticles.length > 0) {
        requestAnimationFrame(updateConfetti);
    }
}

// ===========================
// SCREEN MANAGEMENT
// ===========================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

// Mode selector buttons
document.getElementById('mode-memory-btn').addEventListener('click', () => {
    showScreen('memory-screen');
    initGame();
});

document.getElementById('mode-battle-btn').addEventListener('click', () => {
    showScreen('battle-mode-selector');
});

document.getElementById('battle-vs-cpu-btn').addEventListener('click', () => {
    hpBattleState.isOnline = false;
    showTeamPicker();
});

document.getElementById('battle-vs-online-btn').addEventListener('click', () => {
    if (typeof Peer === 'undefined') {
        alert('Online mode is not available right now. Please check your internet connection.');
        return;
    }
    showBattleLobby();
});

document.getElementById('battle-mode-back-btn').addEventListener('click', () => {
    showScreen('mode-selector');
});

document.getElementById('mode-collection-btn').addEventListener('click', () => {
    showCollectionScreen();
});

// ===========================
// PROGRESSION / LOCALSTORAGE
// ===========================

const DEFAULT_PROGRESS = {
    unlockedPokemon: [...UNLOCK_ORDER],
    stickers: [],
    winStreak: 0,
    totalBattleWins: 0,
    memoryWins: 0,
};

function loadProgress() {
    try {
        const saved = localStorage.getItem('pokemon-progress');
        if (saved) {
            const data = JSON.parse(saved);
            // Merge with defaults to handle new fields
            const merged = { ...DEFAULT_PROGRESS, ...data };
            // Ensure all current Pokemon are unlocked (roster may have changed)
            UNLOCK_ORDER.forEach(id => {
                if (!merged.unlockedPokemon.includes(id)) {
                    merged.unlockedPokemon.push(id);
                }
            });
            return merged;
        }
    } catch (e) {
        console.log('Could not load progress:', e);
    }
    return { ...DEFAULT_PROGRESS };
}

function saveProgress(progress) {
    try {
        localStorage.setItem('pokemon-progress', JSON.stringify(progress));
    } catch (e) {
        console.log('Could not save progress:', e);
    }
}

function unlockNextPokemon() {
    const progress = loadProgress();
    const nextToUnlock = UNLOCK_ORDER.find(id => !progress.unlockedPokemon.includes(id));
    if (nextToUnlock) {
        progress.unlockedPokemon.push(nextToUnlock);
        saveProgress(progress);
        return nextToUnlock;
    }
    return null;
}

function addSticker(pokemonId) {
    const progress = loadProgress();
    if (!progress.stickers.includes(pokemonId)) {
        progress.stickers.push(pokemonId);
        saveProgress(progress);
    }
}

function incrementWinStreak() {
    const progress = loadProgress();
    progress.winStreak++;
    progress.totalBattleWins++;
    saveProgress(progress);
    return progress.winStreak;
}

function resetWinStreak() {
    const progress = loadProgress();
    progress.winStreak = 0;
    saveProgress(progress);
}

function recordMemoryWin() {
    const progress = loadProgress();
    progress.memoryWins++;
    saveProgress(progress);
    return unlockNextPokemon();
}

// ===========================
// MEMORY MATCH GAME (existing)
// ===========================

// Game State
let flippedCards = [];
let matchedPairs = 0;
let totalPairsInGame = 0;
let isLocked = false;
let score = 0;

const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const victoryModal = document.getElementById('victory-modal');

// Initialize Game
function initGame() {
    flippedCards = [];
    matchedPairs = 0;
    score = 0;
    scoreElement.textContent = 'Score: 0';
    isLocked = true;
    gameBoard.innerHTML = '';
    victoryModal.classList.add('hidden');
    confettiParticles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const BOARD_SIZE = 20;
    let gamePokemon = shuffleArray(POKEMON_DATA).slice(0, BOARD_SIZE);
    totalPairsInGame = gamePokemon.length;
    let deck = shuffleArray([...gamePokemon, ...gamePokemon]);

    deck.forEach((pokemon, index) => {
        const card = createCard(pokemon);
        card.classList.add('dealing');
        card.style.animationDelay = `${index * 50}ms`;
        gameBoard.appendChild(card);
    });

    const totalDealTime = (deck.length - 1) * 50 + 350;
    setTimeout(() => {
        document.querySelectorAll('.card.dealing').forEach(card => {
            card.classList.remove('dealing');
            card.style.animationDelay = '';
        });
        isLocked = false;
    }, totalDealTime);
}

function createCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = pokemon.id;
    card.dataset.name = pokemon.name;

    const front = document.createElement('div');
    front.classList.add('card-face', 'card-front');
    const img = document.createElement('img');
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
    img.alt = pokemon.name;
    img.classList.add('card-content');
    img.onerror = () => handleSpriteError(img, pokemon.name);
    front.appendChild(img);

    const back = document.createElement('div');
    back.classList.add('card-face', 'card-back');

    card.appendChild(front);
    card.appendChild(back);
    card.addEventListener('click', () => flipCard(card));
    return card;
}

function flipCard(card) {
    if (isLocked) return;
    if (card === flippedCards[0]) return;
    if (card.classList.contains('flipped')) return;

    playFlipSound();
    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.id === card2.dataset.id;

    if (isMatch) {
        disableCards();
        playMatchSound();
        updateScore();
    } else {
        unflipCards();
    }
}

function disableCards() {
    flippedCards.forEach(card => card.classList.add('matched'));
    flippedCards = [];
    matchedPairs++;

    if (matchedPairs === totalPairsInGame) {
        setTimeout(showVictory, 500);
    }
}

function unflipCards() {
    isLocked = true;
    flippedCards.forEach(card => card.classList.add('wrong'));
    vibrate([50, 30, 50]);
    setTimeout(() => {
        flippedCards.forEach(card => card.classList.remove('wrong', 'flipped'));
        flippedCards = [];
        isLocked = false;
    }, 1000);
}

function updateScore() {
    score++;
    scoreElement.textContent = `Score: ${score}`;
}

function showVictory() {
    vibrate([50, 30, 50, 30, 50, 30, 100]);
    playVictoryFanfare();
    speakVictoryMessage();
    createConfetti();
    victoryModal.classList.remove('hidden');

    // Unlock a new battle Pokemon
    const newPokemon = recordMemoryWin();
    if (newPokemon) {
        const bp = BATTLE_POKEMON.find(p => p.id === newPokemon);
        if (bp) {
            setTimeout(() => {
                showUnlockNotification(bp);
            }, 2000);
        }
    }
}

function showUnlockNotification(pokemon) {
    // Brief notification that a new Pokemon was unlocked
    const notif = document.createElement('div');
    notif.className = 'unlock-notification';
    notif.innerHTML = `
        <img src="${getSpriteUrl(pokemon.id)}" class="unlock-notif-sprite" alt="${pokemon.name}">
        <div class="unlock-notif-text">New Pokemon!<br><strong>${pokemon.name}</strong></div>
    `;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.classList.add('unlock-notif-fade');
        setTimeout(() => notif.remove(), 500);
    }, 3000);
}

restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// ===========================
// BATTLE LOBBY & NETWORKING
// ===========================

let peer = null;
let conn = null;
let isHost = false;

// Lobby DOM elements
const lobbyOnlineChoice = document.getElementById('lobby-online-choice');
const lobbyCreateView = document.getElementById('lobby-create-view');
const lobbyJoinView = document.getElementById('lobby-join-view');
const lobbyRoomCode = document.getElementById('lobby-room-code');
const lobbyCodeInput = document.getElementById('lobby-code-input');
const lobbyJoinStatus = document.getElementById('lobby-join-status');

function showBattleLobby() {
    hpBattleState.isOnline = false;
    isHost = false;
    cleanupPeer();
    showScreen('battle-lobby');
    // Reset to initial choice view
    lobbyOnlineChoice.classList.remove('hidden');
    lobbyCreateView.classList.add('hidden');
    lobbyJoinView.classList.add('hidden');
}

document.getElementById('lobby-online-back-btn').addEventListener('click', () => {
    cleanupPeer();
    showScreen('battle-mode-selector');
});

// Create Room
document.getElementById('lobby-create-btn').addEventListener('click', () => {
    lobbyOnlineChoice.classList.add('hidden');
    lobbyCreateView.classList.remove('hidden');
    createRoom();
});

document.getElementById('lobby-create-back-btn').addEventListener('click', () => {
    cleanupPeer();
    lobbyCreateView.classList.add('hidden');
    lobbyOnlineChoice.classList.remove('hidden');
});

// Join Room
document.getElementById('lobby-join-btn').addEventListener('click', () => {
    lobbyOnlineChoice.classList.add('hidden');
    lobbyJoinView.classList.remove('hidden');
    lobbyCodeInput.value = '';
    lobbyJoinStatus.textContent = '';
    lobbyCodeInput.focus();
});

document.getElementById('lobby-join-back-btn').addEventListener('click', () => {
    cleanupPeer();
    lobbyJoinView.classList.add('hidden');
    lobbyOnlineChoice.classList.remove('hidden');
});

document.getElementById('lobby-connect-btn').addEventListener('click', () => {
    const code = lobbyCodeInput.value.trim();
    if (code.length !== 4 || !/^\d{4}$/.test(code)) {
        lobbyJoinStatus.textContent = 'Enter a 4-digit code!';
        return;
    }
    joinRoom(code);
});

function createRoom(retries = 0) {
    const MAX_RETRIES = 5;
    const code = String(Math.floor(1000 + Math.random() * 9000));
    lobbyRoomCode.textContent = code;
    isHost = true;

    peer = new Peer('pokemon-' + code);

    peer.on('open', () => {
        // Peer is ready, code is displayed
    });

    peer.on('connection', (connection) => {
        conn = connection;
        setupConnection();
    });

    peer.on('error', (err) => {
        if (err.type === 'unavailable-id' && retries < MAX_RETRIES) {
            // Room code collision — regenerate
            peer.destroy();
            createRoom(retries + 1);
        } else {
            console.error('PeerJS error:', err);
            if (retries >= MAX_RETRIES) {
                lobbyRoomCode.textContent = '----';
                lobbyCreateView.classList.add('hidden');
                lobbyOnlineChoice.classList.remove('hidden');
            }
        }
    });
}

let joinTimeout = null;

function joinRoom(code) {
    lobbyJoinStatus.textContent = 'Connecting...';
    isHost = false;

    peer = new Peer();

    joinTimeout = setTimeout(() => {
        lobbyJoinStatus.textContent = 'Connection timed out. Try again.';
        cleanupPeer();
    }, 15000);

    peer.on('open', () => {
        conn = peer.connect('pokemon-' + code, { reliable: true });

        conn.on('open', () => {
            clearTimeout(joinTimeout);
            setupConnection();
        });

        conn.on('error', () => {
            clearTimeout(joinTimeout);
            lobbyJoinStatus.textContent = 'Connection failed! Check the code.';
        });
    });

    peer.on('error', (err) => {
        clearTimeout(joinTimeout);
        console.error('PeerJS error:', err);
        lobbyJoinStatus.textContent = 'Could not connect. Try again.';
    });
}

function setupConnection() {
    conn.on('data', onDataReceived);
    conn.on('close', handleDisconnect);
    hpBattleState.isOnline = true;
    hpBattleState.isHost = isHost;
    // Both players go to team picker
    showTeamPicker();
}

function validateMessage(data) {
    if (!data || typeof data !== 'object' || typeof data.type !== 'string') return false;
    switch (data.type) {
        case 'hp-team-ready':
            return Array.isArray(data.team) && data.team.length === 3 &&
                data.team.every(id => typeof id === 'number');
        case 'hp-start-battle':
            return Array.isArray(data.hostTeam) && data.hostTeam.every(id => typeof id === 'number');
        case 'hp-turn-result':
            return typeof data.resultType === 'string';
        case 'hp-switch-choice':
            return typeof data.newActiveIndex === 'number' &&
                data.newActiveIndex >= 0 && data.newActiveIndex < 3;
        case 'hp-request-switch':
        case 'hp-play-again':
            return true;
        default:
            return false;
    }
}

function onDataReceived(data) {
    if (!validateMessage(data)) {
        console.warn('Invalid network message received:', data);
        return;
    }
    switch (data.type) {
        case 'hp-team-ready':
            handleOpponentTeamReady(data);
            break;
        case 'hp-start-battle':
            handleStartBattle(data);
            break;
        case 'hp-turn-result':
            handleTurnResult(data);
            break;
        case 'hp-request-switch':
            handleRequestSwitch();
            break;
        case 'hp-switch-choice':
            handleSwitchChoice(data);
            break;
        case 'hp-play-again':
            handleHpPlayAgain();
            break;
    }
}

function handleDisconnect() {
    if (hpBattleState.isOnline) {
        hpBattleState.isOnline = false;
        cleanupPeer();
        // Show disconnect overlay
        const overlay = document.getElementById('online-waiting-overlay');
        document.getElementById('online-waiting-text').textContent = 'Opponent disconnected!';
        overlay.classList.remove('hidden');
        setTimeout(() => {
            overlay.classList.add('hidden');
            showScreen('mode-selector');
        }, 2000);
    }
}

function cleanupPeer() {
    if (conn) {
        conn.close();
        conn = null;
    }
    if (peer) {
        peer.destroy();
        peer = null;
    }
}

function sendData(data) {
    if (conn && conn.open) {
        conn.send(data);
    }
}

// ===========================
// ONLINE HP BATTLE PROTOCOL
// ===========================

function handleOpponentTeamReady(data) {
    hpBattleState.opponentTeamIds = data.team;
    // Check if local player already submitted their team
    if (selectedTeam.length === 3 && document.getElementById('online-waiting-overlay').classList.contains('hidden') === false) {
        startOnlineBattle();
    }
}

function startOnlineBattle() {
    const overlay = document.getElementById('online-waiting-overlay');
    overlay.classList.add('hidden');

    const myTeam = selectedTeam.map(p => ({ ...p, currentHp: p.hp }));
    const opponentTeam = hpBattleState.opponentTeamIds.map(id => {
        const bp = BATTLE_POKEMON.find(p => p.id === id);
        return { ...bp, currentHp: bp.hp };
    });

    hpBattleState.opponentTeamIds = null;

    if (hpBattleState.isHost) {
        sendData({
            type: 'hp-start-battle',
            hostTeam: myTeam.map(p => p.id),
            guestTeam: opponentTeam.map(p => p.id),
        });
        // initHpBattle will start the auto-battle loop for host
        initHpBattle(myTeam, opponentTeam);
    } else {
        // Guest: wait for start signal (host will send hp-start-battle)
        hpBattleState._guestTeam = myTeam;
        hpBattleState._guestOpponentTeam = opponentTeam;
    }
}

function handleStartBattle(data) {
    // Guest receives start signal — init battle but don't run auto-battle
    // Guest will receive hp-turn-result messages from host and animate them
    const myTeam = hpBattleState._guestTeam || selectedTeam.map(p => ({ ...p, currentHp: p.hp }));
    const opponentTeam = data.hostTeam.map(id => {
        const bp = BATTLE_POKEMON.find(p => p.id === id);
        return { ...bp, currentHp: bp.hp };
    });

    const overlay = document.getElementById('online-waiting-overlay');
    overlay.classList.add('hidden');

    // initHpBattle won't start auto-battle for guest (isHost is false)
    initHpBattle(myTeam, opponentTeam);
}

// Guest queues incoming turn results and plays them sequentially
let guestAnimationQueue = [];
let guestAnimating = false;

function handleTurnResult(data) {
    // Guest receives auto-battle results from host
    guestAnimationQueue.push(data);
    if (!guestAnimating) {
        processNextGuestAnimation();
    }
}

function processNextGuestAnimation() {
    if (guestAnimationQueue.length === 0) {
        guestAnimating = false;
        return;
    }
    guestAnimating = true;
    const data = guestAnimationQueue.shift();

    if (data.resultType === 'attack') {
        // Map sides — guest's perspective is flipped from host's
        const localTargetSlot = data.targetSlot === 'cpu' ? 'player' : 'cpu';

        let defender;
        if (localTargetSlot === 'cpu') {
            defender = hpBattleState.cpuTeam[hpBattleState.cpuActive];
        } else {
            defender = hpBattleState.playerTeam[hpBattleState.playerActive];
        }

        hpBattleState.phase = 'auto-battling';
        renderBattleScene();

        animateAttack(localTargetSlot, data.damage, data.multiplier, data.attackerType, () => {
            defender.currentHp = Math.max(0, data.newHp);
            renderBattleScene();

            if (data.fainted) {
                animateFaint(localTargetSlot, () => {
                    playFaintSound();
                    if (data.battleOver) {
                        hpBattleState.phase = 'battle-over';
                        guestAnimationQueue = [];
                        if (localTargetSlot === 'cpu') {
                            setTimeout(() => showHpBattleVictory(), 500);
                        } else {
                            setTimeout(() => showHpBattleLoss(), 500);
                        }
                    } else if (localTargetSlot === 'player') {
                        // Guest's own Pokemon fainted — host will send hp-request-switch
                        // Wait for that message (it will show switch overlay)
                        processNextGuestAnimation();
                    } else {
                        // Opponent's Pokemon fainted — wait for auto-switch message from host
                        processNextGuestAnimation();
                    }
                });
            } else {
                setTimeout(() => processNextGuestAnimation(), 600);
            }
        });
    } else if (data.resultType === 'auto-switch') {
        // Host tells us a Pokemon was auto-switched
        // Map side: host's 'cpu' = guest's 'player', host's 'player' = guest's 'cpu'
        const localSlot = data.side === 'cpu' ? 'player' : 'cpu';
        const activeKey = localSlot === 'cpu' ? 'cpuActive' : 'playerActive';
        hpBattleState[activeKey] = data.newActiveIndex;
        renderBattleScene();
        animateSwitchIn(localSlot, () => {
            renderBattleScene();
            setTimeout(() => processNextGuestAnimation(), 600);
        });
    }
}

function handleHpPlayAgain() {
    document.getElementById('hp-battle-result-modal').classList.add('hidden');
    confettiParticles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hpBattleState.opponentTeamIds = null;
    guestAnimationQueue = [];
    guestAnimating = false;
    showTeamPicker();
}

// Guest receives: "your Pokemon fainted, pick replacement"
function handleRequestSwitch() {
    // Guest's own Pokemon fainted (host's 'cpu' = guest's 'player')
    // Show switch overlay for guest to pick
    hpBattleState._pendingSwitchSlot = 'player';
    hpBattleState._pendingNextAttacker = null; // Guest doesn't run auto-battle
    showSwitchOverlay(hpBattleState.playerTeam, hpBattleState.playerActive);
    // onPlayerSwitch() will send hp-switch-choice to host
}

// Host receives: guest picked their replacement
function handleSwitchChoice(data) {
    const newIndex = data.newActiveIndex;
    hpBattleState.cpuActive = newIndex;

    // Don't send auto-switch back to guest — guest already animated their own switch locally

    renderBattleScene();
    animateSwitchIn('cpu', () => {
        renderBattleScene();
        // Resume auto-battle
        setTimeout(() => runAutoBattle(hpBattleState._pendingNextAttacker), 600);
    });
}

function getSpriteUrl(pokemonId) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
}

function handleSpriteError(img, pokemonName) {
    img.onerror = null;
    img.style.display = 'none';
    const fallback = document.createElement('div');
    fallback.textContent = pokemonName || '?';
    fallback.style.cssText = 'font-size: 2.5vh; font-weight: bold; color: #666; text-align: center; padding: 1vh;';
    img.parentNode.insertBefore(fallback, img.nextSibling);
}

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ===========================
// HP BATTLE MODE (new)
// ===========================

const hpBattleState = {
    playerTeam: [],      // [{...pokemon, currentHp}, ...]
    cpuTeam: [],         // Also used for opponent team in online mode
    playerActive: 0,     // index into playerTeam
    cpuActive: 0,
    phase: 'idle',       // auto-battling, battle-over
    isOnline: false,
    isHost: false,
    opponentTeamIds: null, // Received opponent team IDs (waiting state)
};

// Team Picker
let selectedTeam = [];

function showTeamPicker() {
    selectedTeam = [];
    showScreen('team-picker');
    renderTeamPickerGrid();
    updateTeamCounter();
    document.getElementById('start-battle-btn').disabled = true;
}

function renderTeamPickerGrid() {
    const grid = document.getElementById('team-picker-grid');
    grid.innerHTML = '';
    const progress = loadProgress();

    BATTLE_POKEMON.forEach((pokemon) => {
        const card = document.createElement('div');
        const isUnlocked = progress.unlockedPokemon.includes(pokemon.id);
        card.classList.add('team-card');

        if (!isUnlocked) {
            card.classList.add('locked');
            card.innerHTML = `
                <div class="locked-icon">?</div>
                <div class="team-card-name">???</div>
            `;
        } else {
            const isSelected = selectedTeam.some(p => p.id === pokemon.id);
            if (isSelected) card.classList.add('selected');

            card.style.borderColor = TYPE_COLORS[pokemon.type];
            card.innerHTML = `
                <img src="${getSpriteUrl(pokemon.id)}" class="team-card-sprite" alt="${pokemon.name}">
                <div class="team-card-name">${pokemon.name}</div>
                <div class="team-card-info">
                    <span class="type-badge type-${pokemon.type}">${pokemon.type}</span>
                    <span class="team-card-hp">❤️${pokemon.hp}</span>
                </div>
                ${isSelected ? '<div class="team-card-check">✓</div>' : ''}
            `;

            card.addEventListener('click', () => {
                togglePokemonSelection(pokemon);
            });
        }

        grid.appendChild(card);
    });
}

function togglePokemonSelection(pokemon) {
    const idx = selectedTeam.findIndex(p => p.id === pokemon.id);
    if (idx >= 0) {
        selectedTeam.splice(idx, 1);
    } else if (selectedTeam.length < 3) {
        selectedTeam.push(pokemon);
        playFlipSound();
    } else {
        return; // Already 3 selected
    }
    renderTeamPickerGrid();
    updateTeamCounter();
    document.getElementById('start-battle-btn').disabled = selectedTeam.length !== 3;
}

function updateTeamCounter() {
    document.getElementById('team-counter').textContent = `${selectedTeam.length} / 3`;
}

document.getElementById('team-picker-back-btn').addEventListener('click', () => {
    if (hpBattleState.isOnline) {
        cleanupPeer();
        hpBattleState.isOnline = false;
    }
    showScreen('battle-mode-selector');
});

document.getElementById('start-battle-btn').addEventListener('click', () => {
    if (selectedTeam.length !== 3) return;
    startBattleWithTeam();
});

function cpuPickTeam(playerTeam) {
    const progress = loadProgress();
    const available = BATTLE_POKEMON.filter(p =>
        progress.unlockedPokemon.includes(p.id) &&
        !playerTeam.some(pt => pt.id === p.id)
    );
    // If not enough unlocked Pokemon, use all battle Pokemon
    const pool = available.length >= 3 ? available : BATTLE_POKEMON.filter(p =>
        !playerTeam.some(pt => pt.id === p.id)
    );
    return shuffleArray(pool).slice(0, 3);
}

function startBattleWithTeam() {
    if (hpBattleState.isOnline) {
        // Send team to opponent
        sendData({
            type: 'hp-team-ready',
            team: selectedTeam.map(p => p.id),
        });
        // Show waiting overlay
        const overlay = document.getElementById('online-waiting-overlay');
        document.getElementById('online-waiting-text').textContent = 'Waiting for opponent...';
        overlay.classList.remove('hidden');
        document.getElementById('start-battle-btn').disabled = true;

        // Check if opponent already sent their team
        if (hpBattleState.opponentTeamIds) {
            startOnlineBattle();
        }
    } else {
        const playerTeam = selectedTeam.map(p => ({ ...p, currentHp: p.hp }));
        const cpuTeamRaw = cpuPickTeam(selectedTeam);
        const cpuTeam = cpuTeamRaw.map(p => ({ ...p, currentHp: p.hp }));
        initHpBattle(playerTeam, cpuTeam);
    }
}

function initHpBattle(playerTeam, cpuTeam) {
    hpBattleState.playerTeam = playerTeam;
    hpBattleState.cpuTeam = cpuTeam;
    hpBattleState.playerActive = 0;
    hpBattleState.cpuActive = 0;
    hpBattleState.phase = 'auto-battling';

    showScreen('hp-battle-screen');

    // Clear any previous state
    confettiParticles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('hp-battle-result-modal').classList.add('hidden');
    document.getElementById('online-waiting-overlay').classList.add('hidden');
    document.getElementById('switch-overlay').classList.add('hidden');

    renderBattleScene();

    // Start auto-battle after a brief delay so player can see both teams
    if (!hpBattleState.isOnline || hpBattleState.isHost) {
        setTimeout(() => runAutoBattle('player'), 1000);
    }
}

function runAutoBattle(attackerSide) {
    if (hpBattleState.phase === 'battle-over') return;
    hpBattleState.phase = 'auto-battling';

    let attacker, defender, targetSlot;
    if (attackerSide === 'player') {
        attacker = hpBattleState.playerTeam[hpBattleState.playerActive];
        defender = hpBattleState.cpuTeam[hpBattleState.cpuActive];
        targetSlot = 'cpu';
    } else {
        attacker = hpBattleState.cpuTeam[hpBattleState.cpuActive];
        defender = hpBattleState.playerTeam[hpBattleState.playerActive];
        targetSlot = 'player';
    }

    const multiplier = getTypeMultiplier(attacker.type, defender.type);
    const damage = Math.max(1, Math.round(attacker.baseDamage * multiplier));

    // Send attack result to online guest
    if (hpBattleState.isOnline && hpBattleState.isHost) {
        const defenderNewHp = Math.max(0, defender.currentHp - damage);
        const fainted = defenderNewHp <= 0;
        let battleOver = false;
        if (fainted) {
            const faintedTeam = targetSlot === 'cpu' ? hpBattleState.cpuTeam : hpBattleState.playerTeam;
            const faintedActive = targetSlot === 'cpu' ? hpBattleState.cpuActive : hpBattleState.playerActive;
            const hasMore = faintedTeam.some((p, i) => i !== faintedActive && p.currentHp > 0);
            if (!hasMore) battleOver = true;
        }
        sendData({
            type: 'hp-turn-result',
            resultType: 'attack',
            attackerSide: attackerSide,
            targetSlot: targetSlot,
            damage: damage,
            multiplier: multiplier,
            attackerType: attacker.type,
            newHp: Math.max(0, defender.currentHp - damage),
            fainted: fainted,
            battleOver: battleOver,
        });
    }

    // Animate the attack
    animateAttack(targetSlot, damage, multiplier, attacker.type, () => {
        defender.currentHp = Math.max(0, defender.currentHp - damage);
        renderBattleScene();

        if (defender.currentHp <= 0) {
            animateFaint(targetSlot, () => {
                playFaintSound();
                const faintedTeam = targetSlot === 'cpu' ? hpBattleState.cpuTeam : hpBattleState.playerTeam;
                const faintedActiveKey = targetSlot === 'cpu' ? 'cpuActive' : 'playerActive';
                const hasMore = faintedTeam.some((p, i) => i !== hpBattleState[faintedActiveKey] && p.currentHp > 0);

                if (!hasMore) {
                    // Battle over
                    hpBattleState.phase = 'battle-over';
                    if (targetSlot === 'cpu') {
                        setTimeout(() => showHpBattleVictory(), 500);
                    } else {
                        setTimeout(() => showHpBattleLoss(), 500);
                    }
                } else {
                    // A Pokemon fainted but the team has more alive
                    const nextAttacker = attackerSide === 'player' ? 'cpu' : 'player';

                    if (targetSlot === 'player') {
                        // Player's Pokemon fainted — player picks replacement
                        hpBattleState._pendingNextAttacker = nextAttacker;
                        hpBattleState._pendingSwitchSlot = 'player';
                        showSwitchOverlay(hpBattleState.playerTeam, hpBattleState.playerActive);
                        // onPlayerSwitch() will resume the loop
                    } else {
                        // Opponent's Pokemon fainted (targetSlot === 'cpu')
                        if (!hpBattleState.isOnline) {
                            // CPU mode: auto-switch (CPU picks first alive)
                            const nextAlive = faintedTeam.findIndex((p, i) => i !== hpBattleState[faintedActiveKey] && p.currentHp > 0);
                            hpBattleState[faintedActiveKey] = nextAlive;

                            renderBattleScene();
                            animateSwitchIn(targetSlot, () => {
                                renderBattleScene();
                                setTimeout(() => runAutoBattle(nextAttacker), 600);
                            });
                        } else {
                            // Online mode (host): ask guest to pick replacement
                            hpBattleState._pendingNextAttacker = nextAttacker;
                            sendData({
                                type: 'hp-request-switch',
                            });
                            // Pause auto-battle. Wait for guest's hp-switch-choice reply.
                        }
                    }
                }
            });
        } else {
            // No faint — switch attacker and continue
            const nextAttacker = attackerSide === 'player' ? 'cpu' : 'player';
            setTimeout(() => runAutoBattle(nextAttacker), 600);
        }
    });
}

// ===========================
// SWITCH OVERLAY (faint replacement picker)
// ===========================

function showSwitchOverlay(team, activeIndex) {
    const list = document.getElementById('switch-pokemon-list');
    list.innerHTML = '';

    team.forEach((pokemon, index) => {
        if (index === activeIndex || pokemon.currentHp <= 0) return;

        const card = document.createElement('div');
        card.className = 'switch-card';
        card.style.borderColor = TYPE_COLORS[pokemon.type];
        card.innerHTML = `
            <img src="${getSpriteUrl(pokemon.id)}" class="switch-card-sprite" alt="${pokemon.name}">
            <div class="switch-card-info">
                <div class="switch-card-name">${pokemon.name}</div>
                <span class="type-badge type-${pokemon.type}">${pokemon.type}</span>
                <div class="switch-card-hp">❤️ ${pokemon.currentHp} / ${pokemon.hp}</div>
            </div>
        `;
        card.addEventListener('click', () => {
            onPlayerSwitch(index);
        });
        list.appendChild(card);
    });

    document.getElementById('switch-overlay').classList.remove('hidden');
}

function onPlayerSwitch(newIndex) {
    document.getElementById('switch-overlay').classList.add('hidden');

    const pendingNextAttacker = hpBattleState._pendingNextAttacker;
    const switchSlot = hpBattleState._pendingSwitchSlot;

    if (switchSlot === 'player') {
        hpBattleState.playerActive = newIndex;
    } else {
        hpBattleState.cpuActive = newIndex;
    }

    // Online: notify the other side about the switch
    if (hpBattleState.isOnline) {
        if (hpBattleState.isHost) {
            // Host picked for 'player' side — send auto-switch to guest
            sendData({
                type: 'hp-turn-result',
                resultType: 'auto-switch',
                side: 'player',
                newActiveIndex: newIndex,
            });
        } else {
            // Guest picked — send choice to host
            sendData({
                type: 'hp-switch-choice',
                newActiveIndex: newIndex,
            });
        }
    }

    renderBattleScene();
    animateSwitchIn(switchSlot, () => {
        renderBattleScene();
        // Resume auto-battle (host or CPU mode)
        if (!hpBattleState.isOnline || hpBattleState.isHost) {
            setTimeout(() => runAutoBattle(pendingNextAttacker), 600);
        }
        // Guest: after animating own switch, just resume the queue
        if (hpBattleState.isOnline && !hpBattleState.isHost) {
            setTimeout(() => processNextGuestAnimation(), 600);
        }
    });
}

function renderBattleScene() {
    const player = hpBattleState.playerTeam[hpBattleState.playerActive];
    const cpu = hpBattleState.cpuTeam[hpBattleState.cpuActive];

    // CPU display
    document.getElementById('cpu-pokemon-name').textContent = cpu.name;
    const cpuTypeBadge = document.getElementById('cpu-pokemon-type');
    cpuTypeBadge.textContent = cpu.type;
    cpuTypeBadge.className = `type-badge type-${cpu.type}`;
    const cpuSprite = document.getElementById('cpu-pokemon-sprite');
    cpuSprite.src = getSpriteUrl(cpu.id);
    cpuSprite.alt = cpu.name;
    cpuSprite.onerror = () => handleSpriteError(cpuSprite, cpu.name);
    renderHpBar('cpu-hp-bar', 'cpu-hp-text', cpu.currentHp, cpu.hp);

    // Player display
    document.getElementById('player-pokemon-name').textContent = player.name;
    const playerTypeBadge = document.getElementById('player-pokemon-type');
    playerTypeBadge.textContent = player.type;
    playerTypeBadge.className = `type-badge type-${player.type}`;
    const playerSprite = document.getElementById('player-pokemon-sprite');
    playerSprite.src = getSpriteUrl(player.id);
    playerSprite.alt = player.name;
    playerSprite.onerror = () => handleSpriteError(playerSprite, player.name);
    renderHpBar('player-hp-bar', 'player-hp-text', player.currentHp, player.hp);

    // Team dots
    renderTeamDots('cpu-team-dots', hpBattleState.cpuTeam);
    renderTeamDots('player-team-dots', hpBattleState.playerTeam);
}

function renderHpBar(barId, textId, current, max) {
    const bar = document.getElementById(barId);
    const text = document.getElementById(textId);
    const pct = Math.max(0, (current / max) * 100);
    bar.style.width = pct + '%';

    // Color based on percentage
    if (pct > 50) {
        bar.style.background = '#4CAF50';
    } else if (pct > 25) {
        bar.style.background = '#FFC107';
    } else {
        bar.style.background = '#f44336';
    }

    text.textContent = `${Math.max(0, current)} / ${max}`;
}

function renderTeamDots(containerId, team) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    team.forEach((p) => {
        const dot = document.createElement('span');
        dot.classList.add('team-dot');
        if (p.currentHp <= 0) {
            dot.classList.add('fainted');
        }
        container.appendChild(dot);
    });
}

function animateAttack(targetSlot, damage, multiplier, attackerType, callback) {
    const spriteId = targetSlot === 'cpu' ? 'cpu-pokemon-sprite' : 'player-pokemon-sprite';
    const calloutId = targetSlot === 'cpu' ? 'cpu-damage-callout' : 'player-damage-callout';
    const displayId = targetSlot === 'cpu' ? 'cpu-pokemon-display' : 'player-pokemon-display';
    const sprite = document.getElementById(spriteId);
    const callout = document.getElementById(calloutId);
    const display = document.getElementById(displayId);

    // Attacker animation (opposite side slides forward)
    const attackerSpriteId = targetSlot === 'cpu' ? 'player-pokemon-sprite' : 'cpu-pokemon-sprite';
    const attackerSprite = document.getElementById(attackerSpriteId);

    playAttackSound(attackerType);

    // Attacker slides forward
    attackerSprite.classList.add('sprite-attack');

    setTimeout(() => {
        attackerSprite.classList.remove('sprite-attack');

        // Hit flash on target
        sprite.classList.add('sprite-hit');
        if (multiplier >= 2) {
            display.classList.add('screen-shake');
            playSuperEffectiveSound();
        }

        // Show damage callout
        callout.classList.remove('hidden');
        if (multiplier >= 2) {
            callout.textContent = `SUPER! -${damage}`;
            callout.className = 'damage-callout super-effective';
        } else if (multiplier <= 0.5) {
            callout.textContent = `Weak... -${damage}`;
            callout.className = 'damage-callout not-effective';
        } else {
            callout.textContent = `-${damage}`;
            callout.className = 'damage-callout neutral-hit';
        }

        // HP bar drain
        setTimeout(() => {
            sprite.classList.remove('sprite-hit');
            display.classList.remove('screen-shake');

            setTimeout(() => {
                callout.classList.add('hidden');
                callout.className = 'damage-callout hidden';
                if (callback) callback();
            }, 400);
        }, 600);
    }, 300);
}

function animateFaint(slot, callback) {
    const spriteId = slot === 'cpu' ? 'cpu-pokemon-sprite' : 'player-pokemon-sprite';
    const sprite = document.getElementById(spriteId);
    sprite.classList.add('sprite-faint');

    setTimeout(() => {
        sprite.classList.remove('sprite-faint');
        if (callback) callback();
    }, 500);
}

function animateSwitchIn(slot, callback) {
    const spriteId = slot === 'cpu' ? 'cpu-pokemon-sprite' : 'player-pokemon-sprite';
    const sprite = document.getElementById(spriteId);

    // Update sprite first
    const team = slot === 'cpu' ? hpBattleState.cpuTeam : hpBattleState.playerTeam;
    const activeIdx = slot === 'cpu' ? hpBattleState.cpuActive : hpBattleState.playerActive;
    const pokemon = team[activeIdx];
    sprite.src = getSpriteUrl(pokemon.id);

    sprite.classList.add('sprite-switch-in');
    playFlipSound();

    setTimeout(() => {
        sprite.classList.remove('sprite-switch-in');
        renderBattleScene();
        if (callback) callback();
    }, 400);
}

function showHpBattleVictory() {
    const streak = incrementWinStreak();
    const cpuDefeated = hpBattleState.cpuTeam[hpBattleState.cpuActive];
    addSticker(cpuDefeated.id);

    // Add stickers for all opponent team Pokemon
    hpBattleState.cpuTeam.forEach(p => addSticker(p.id));

    const modal = document.getElementById('hp-battle-result-modal');
    document.getElementById('hp-battle-winner-text').textContent = 'You Win!';

    // Show sticker (only for CPU mode)
    const stickerArea = document.getElementById('hp-battle-sticker');
    if (hpBattleState.isOnline) {
        stickerArea.classList.add('hidden');
    } else {
        const stickerSprite = document.getElementById('hp-sticker-sprite');
        stickerSprite.src = getSpriteUrl(cpuDefeated.id);
        stickerArea.classList.remove('hidden');
    }

    // Show streak
    const streakEl = document.getElementById('hp-battle-streak');
    if (streak >= 3) {
        streakEl.textContent = '⭐'.repeat(Math.min(streak, 10)) + ' Win Streak!';
    } else {
        streakEl.textContent = '⭐'.repeat(streak);
    }

    modal.classList.remove('hidden');
    playVictoryFanfare();
    speakVictoryMessage();
    createConfetti();
    vibrate([50, 30, 50, 30, 50, 30, 100]);
}

function showHpBattleLoss() {
    if (!hpBattleState.isOnline) {
        resetWinStreak();
    }

    const modal = document.getElementById('hp-battle-result-modal');
    document.getElementById('hp-battle-winner-text').textContent = hpBattleState.isOnline ? 'You Lose!' : 'Good Try!';
    document.getElementById('hp-battle-sticker').classList.add('hidden');
    document.getElementById('hp-battle-streak').textContent = hpBattleState.isOnline ? 'Better luck next time!' : 'You can do it next time!';

    modal.classList.remove('hidden');
    playTieSting();
    vibrate([50, 30, 50]);
}

// HP Battle modal buttons
document.getElementById('hp-battle-again-btn').addEventListener('click', () => {
    document.getElementById('hp-battle-result-modal').classList.add('hidden');
    confettiParticles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (hpBattleState.isOnline) {
        sendData({ type: 'hp-play-again' });
        hpBattleState.opponentTeamIds = null;
        showTeamPicker();
    } else {
        showTeamPicker();
    }
});

document.getElementById('hp-battle-menu-btn-modal').addEventListener('click', () => {
    document.getElementById('hp-battle-result-modal').classList.add('hidden');
    confettiParticles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (hpBattleState.isOnline) {
        cleanupPeer();
        hpBattleState.isOnline = false;
    }
    showScreen('mode-selector');
});

document.getElementById('hp-battle-menu-btn').addEventListener('click', () => {
    if (hpBattleState.isOnline) {
        cleanupPeer();
        hpBattleState.isOnline = false;
    }
    showScreen('mode-selector');
});

// ===========================
// COLLECTION SCREEN
// ===========================

function showCollectionScreen() {
    showScreen('collection-screen');
    renderCollectionGrid();
    renderWinStreak();
}

function renderCollectionGrid() {
    const grid = document.getElementById('collection-grid');
    grid.innerHTML = '';
    const progress = loadProgress();

    BATTLE_POKEMON.forEach((pokemon) => {
        const card = document.createElement('div');
        const isUnlocked = progress.unlockedPokemon.includes(pokemon.id);
        const hasSticker = progress.stickers.includes(pokemon.id);

        card.classList.add('collection-card');

        if (!isUnlocked) {
            card.classList.add('collection-locked');
            card.innerHTML = `
                <div class="collection-silhouette">?</div>
                <div class="collection-card-name">???</div>
            `;
        } else {
            if (hasSticker) card.classList.add('collection-sticker');
            card.style.borderColor = TYPE_COLORS[pokemon.type];
            card.innerHTML = `
                <img src="${getSpriteUrl(pokemon.id)}" class="collection-card-sprite" alt="${pokemon.name}">
                <div class="collection-card-name">${pokemon.name}</div>
                <div class="collection-card-info">
                    <span class="type-badge type-${pokemon.type}">${pokemon.type}</span>
                    <span class="collection-card-hp">❤️${pokemon.hp}</span>
                </div>
                ${hasSticker ? '<div class="sticker-badge">⭐</div>' : ''}
            `;
        }

        grid.appendChild(card);
    });
}

function renderWinStreak() {
    const progress = loadProgress();
    const display = document.getElementById('win-streak-display');
    if (progress.winStreak > 0) {
        display.textContent = '⭐'.repeat(Math.min(progress.winStreak, 10));
    } else {
        display.textContent = '';
    }
}

document.getElementById('collection-back-btn').addEventListener('click', () => {
    showScreen('mode-selector');
});

// ===========================
// STARTUP — show mode selector
// ===========================
showScreen('mode-selector');
