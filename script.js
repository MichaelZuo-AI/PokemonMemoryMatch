// Pokemon Data (ID matches PokeAPI for potential future use)
const POKEMON_DATA = [
    { id: 25, name: 'Pikachu', color: '#feca1b' },
    { id: 1, name: 'Bulbasaur', color: '#78c850' },
    { id: 4, name: 'Charmander', color: '#f08030' },
    { id: 7, name: 'Squirtle', color: '#6890f0' },
    { id: 94, name: 'Gengar', color: '#705898' },
    { id: 133, name: 'Eevee', color: '#a8a878' },
    { id: 54, name: 'Psyduck', color: '#f8d030' },
    { id: 150, name: 'Mewtwo', color: '#c6c6a7' },
];

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

    confettiParticles.forEach((p, index) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        if (p.y > canvas.height) {
            confettiParticles.splice(index, 1);
        }
    });

    if (confettiParticles.length > 0) {
        requestAnimationFrame(updateConfetti);
    }
}

// Game State
let flippedCards = [];
let matchedPairs = 0;
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

    let gamePokemon = [...POKEMON_DATA];
    let deck = [...gamePokemon, ...gamePokemon];
    deck.sort(() => Math.random() - 0.5);

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

    if (matchedPairs === POKEMON_DATA.length) {
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
}

restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

initGame();
