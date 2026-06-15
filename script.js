// 1. Broadened Character Database Mapping Matrix
const characters = [
    { name: "Harry Potter", desc: "The Boy Who Lived from Hogwarts.", image: "https://unsplash.com", traits: { real: "no", human: "yes", magic: "yes", marvel: "no", tech: "no" } },
    { name: "Iron Man", desc: "Tony Stark, the billionaire genius in armor.", image: "https://unsplash.com", traits: { real: "no", human: "yes", magic: "no", marvel: "yes", tech: "yes" } },
    { name: "Elon Musk", desc: "The tech billionaire behind SpaceX and Tesla.", image: "https://unsplash.com", traits: { real: "yes", human: "yes", magic: "no", marvel: "no", tech: "yes" } },
    { name: "Spider-Man", desc: "Peter Parker, your friendly neighborhood hero.", image: "https://unsplash.com", traits: { real: "no", human: "yes", magic: "no", marvel: "yes", tech: "no" } },
    { name: "Siri / Alexa", desc: "An artificial intelligence voice assistant.", image: "https://unsplash.com", traits: { real: "yes", human: "no", magic: "no", marvel: "no", tech: "yes" } },
    { name: "Yoda", desc: "The legendary Grand Master of the Jedi Order.", image: "https://unsplash.com", traits: { real: "no", human: "no", magic: "yes", marvel: "no", tech: "no" } },
    { name: "Hermione Granger", desc: "The brightest witch of her age from Hogwarts.", image: "https://unsplash.com", traits: { real: "no", human: "yes", magic: "yes", marvel: "no", tech: "no" } },
    { name: "Doctor Strange", desc: "The Sorcerer Supreme protective layout master.", image: "https://unsplash.com", traits: { real: "no", human: "yes", magic: "yes", marvel: "yes", tech: "no" } }
];

const questions = [
    { id: "real", text: "Is your character a real-world living person or entity?", bg: "https://unsplash.com", portrait: "https://unsplash.com" },
    { id: "human", text: "Is your character a human being?", bg: "https://unsplash.com", portrait: "https://unsplash.com" },
    { id: "magic", text: "Does your character wield magic or supernatural powers?", bg: "https://unsplash.com", portrait: "https://unsplash.com" },
    { id: "marvel", text: "Is your character from the Marvel Universe?", bg: "https://unsplash.com", portrait: "https://unsplash.com" },
    { id: "tech", text: "Is your character heavily associated with technology?", bg: "https://unsplash.com", portrait: "https://unsplash.com" }
];

let currentQuestionIndex = 0;
let scores = {};
let totalPointsAwarded = 0; // Tracks if all candidates are completely penalized

// 2. ✨ HTML5 Canvas Spell Dust Particle System
const canvas = document.getElementById('magic-canvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class MagicParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * -3 - 0.5; // Rise up naturally
        this.color = `hsl(${Math.random() * 60 + 260}, 100%, 70%)`; // Magical purples & pinks
        this.alpha = 1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.015;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
}

function handleParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        if (particlesArray[i].alpha <= 0) {
            particlesArray.splice(i, 1);
            i--;
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// Follow cursor movements with spell dust trails
window.addEventListener('mousemove', (e) => {
    if(Math.random() < 0.4) { // Limits particle overhead density
        particlesArray.push(new MagicParticle(e.clientX, e.clientY));
    }
});

function burstMagic(x, y) {
    for(let i=0; i<20; i++){
        particlesArray.push(new MagicParticle(x, y));
    }
}

// 3. 🧠 Game Loop Engine with Anti-Cheat Algorithms
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const questionNumberText = document.getElementById('question-number');
const questionText = document.getElementById('question-text');
const progressBar = document.getElementById('progress-bar');
const guessName = document.getElementById('guess-name');
const guessDescription = document.getElementById('guess-description');
const bgOverlay = document.getElementById('bg-overlay');
const mainPortrait = document.getElementById('main-portrait');
const resultPortrait = document.getElementById('result-portrait');
const cheatWarning = document.getElementById('cheat-warning');
const resultHeading = document.getElementById('result-heading');

const soundClick = document.getElementById('sound-click');
const soundMagic = document.getElementById('sound-magic');

function playSFX(audioElement) {
    audioElement.currentTime = 0;
    audioElement.play().catch(() => {});
}

startBtn.addEventListener('click', (e) => {
    burstMagic(e.clientX, e.clientY);
    startGame();
});
restartBtn.addEventListener('click', (e) => {
    burstMagic(e.clientX, e.clientY);
    startGame();
});

function startGame() {
    playSFX(soundMagic);
    currentQuestionIndex = 0;
    totalPointsAwarded = 0;
    cheatWarning.classList.add('hidden');
    resultHeading.innerText = "The spirits whisper...";
    
    characters.forEach(char => scores[char.name] = 0);
    
    startScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    questionScreen.classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        const q = questions[currentQuestionIndex];
        bgOverlay.style.backgroundImage = `url('${q.bg}')`;
        if(mainPortrait) mainPortrait.src = q.portrait;

        progressBar.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;
        questionNumberText.innerText = `Incantation Spell: ${currentQuestionIndex + 1}`;
        questionText.innerText = q.text;
    } else {
        endGame();
    }
}

document.querySelectorAll('.option-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        playSFX(soundClick);
        burstMagic(e.clientX, e.clientY);
        
        const userChoice = e.target.getAttribute('data-answer');
        const currentQuestion = questions[currentQuestionIndex];

        characters.forEach(char => {
            const traitValue = char.traits[currentQuestion.id];
            if (userChoice === 'yes' && traitValue === 'yes') { scores[char.name] += 10; totalPointsAwarded += 10; }
            else if (userChoice === 'no' && traitValue === 'no') { scores[char.name] += 10; totalPointsAwarded += 10; }
            else if (userChoice === 'maybe') { scores[char.name] += 2; }
            else { scores[char.name] -= 8; } // Stronger cheat contradiction penalty
        });

        // Anti-Cheat: If every character's score drops low, the user is likely giving contradictory responses.
        const highestCurrentScore = Math.max(...Object.values(scores));
        if (highestCurrentScore < -10) {
            cheatWarning.classList.remove('hidden');
        }

        currentQuestionIndex++;
        showQuestion();
    });
});

function endGame() {
    playSFX(soundMagic);
    progressBar.style.width = '100%';
    questionScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    let bestMatch = characters[0];
    let highestScore = scores[bestMatch.name];

    characters.forEach(char => {
        if (scores[char.name] > highestScore) {
            highestScore = scores[char.name];
            bestMatch = char;
        }
    });

    // Check if the user cheated and broke the decision matrix entirely
    if (highestScore < 0) {
        resultHeading.innerText = "The ritual failed!";
        guessName.innerText = "The Trickster Spirit";
        guessDescription.innerText = "Your answers were too contradictory. The spirits cannot reveal a true character.";
        resultPortrait.src = "https://unsplash.com"; // Placeholder for a mysterious image
    }   
    else {
        guessName.innerText = bestMatch.name;
        guessDescription.innerText = bestMatch.desc;
        resultPortrait.src = bestMatch.image;
    }
}







