const fixedWords = [
    "blank", "index", "bold", "cloud", "vibes", "knot", "sail", "noon", 
    "quill", "rose", "jolt", "flux", "byte", "code", "data", "echo",
    "fire", "glow", "heat", "icon", "jump", "kite", "lamp", "moon",
    "node", "open", "peak", "quiz", "rain", "star", "time", "unit",
    "view", "wind", "xenon", "yarn", "zero", "apple", "beach", "crane",
    "dream", "eagle", "flame", "grape", "house", "image", "juice", "knife",
    "lemon", "mouse"
];

let timeLeft = 60;
let timer = null;
let isRunning = false;
let currentText = [];
let charIndex = 0;
let wordIndex = 0;
let wordsToShow = 10; // Show only 10 words at a time

const textDisplay = document.getElementById('textDisplay');
const timerElement = document.getElementById('timer');

const hiddenInput = document.createElement('input');
hiddenInput.type = 'text';
hiddenInput.id = 'hiddenInput';
document.body.appendChild(hiddenInput);

function initText() {
    // Start with first 10 words
    loadNextWords();
}

function loadNextWords() {
    // Get next batch of words
    const startIndex = wordIndex;
    const endIndex = Math.min(startIndex + wordsToShow, fixedWords.length);
    const visibleWords = fixedWords.slice(startIndex, endIndex);
    
    currentText = visibleWords.join(' ').split('');
    displayText();
}

function displayText() {
    textDisplay.innerHTML = currentText.map((char, index) => {
        return `<span class="char" id="char-${index}">${char}</span>`;
    }).join('');
    if (currentText.length > 0) {
        document.getElementById('char-0').classList.add('current');
    }
}

function startTimer() {
    isRunning = true;
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

textDisplay.addEventListener('click', () => {
    hiddenInput.focus();
});

hiddenInput.addEventListener('input', (e) => {
    if (!isRunning && timeLeft === 60) {
        startTimer();
    }

    const inputValue = e.target.value;
    const inputChars = inputValue.split('');
    
    document.querySelectorAll('.char').forEach(char => {
        char.classList.remove('correct', 'incorrect', 'current');
    });

    inputChars.forEach((char, index) => {
        const charElement = document.getElementById(`char-${index}`);
        if (charElement) {
            if (char === currentText[index]) {
                charElement.classList.add('correct');
            } else {
                charElement.classList.add('incorrect');
            }
        }
    });

    const currentIndex = inputChars.length;
    if (currentIndex < currentText.length) {
        const currentChar = document.getElementById(`char-${currentIndex}`);
        if (currentChar) {
            currentChar.classList.add('current');
        }
    }

    charIndex = inputChars.length;

    // Check if user has typed through most of the visible words
    if (charIndex >= currentText.length * 0.7 && wordIndex + wordsToShow < fixedWords.length) {
        // Load next batch of words
        wordIndex += 5; // Move forward by 5 words
        loadNextWords();
        hiddenInput.value = '';
        charIndex = 0;
    }

    // Loop back to start when we've gone through all words
    if (wordIndex >= fixedWords.length) {
        wordIndex = 0;
        loadNextWords();
        hiddenInput.value = '';
        charIndex = 0;
        document.querySelectorAll('.char').forEach(char => {
            char.classList.remove('correct', 'incorrect', 'current');
        });
        const firstChar = document.getElementById('char-0');
        if (firstChar) {
            firstChar.classList.add('current');
        }
    }
});

hiddenInput.addEventListener('paste', (e) => {
    e.preventDefault();
});

function endTest() {
    clearInterval(timer);
    isRunning = false;
    hiddenInput.disabled = true;
}

document.addEventListener('keydown', () => {
    if (!hiddenInput.disabled) {
        hiddenInput.focus();
    }
});

initText();
hiddenInput.focus();