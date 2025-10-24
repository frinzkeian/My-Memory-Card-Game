const matchSound = new Audio('assets/match.mp3');
 const clickSound = new Audio('assets/click.mp3');
 const bgm = new Audio('assets/bgm.mp3');
 const buttonSound = new Audio('assets/button.mp3');

bgm.loop = true;
bgm.volume = 1;
 const musicToggle = document.getElementById('music-toggle');
let bgmPlaying = true; // default on

musicToggle.addEventListener('click', () => {
    if (bgmPlaying) {
        bgm.pause();
        musicToggle.textContent = '🎵 Music Off';
        bgmPlaying = false;
    } else {
        bgm.play();
        musicToggle.textContent = '🎵 Music On';
        bgmPlaying = true;
    }
});

        const wrongSound = new Audio('assets/wrong.mp3');
        const winSound = new Audio('assets/win.mp3');
        winSound.preload = 'auto';
        const loseSound = new Audio('assets/lose.mp3');
        loseSound.preload = 'auto';

const gridContainer = document.querySelector('.grid-container');
let timeStarted = false;
let timeLeft = 60;
let timeInterval;
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score= 0;
let difficulty = 'easy';

document.getElementById('easy-btn').addEventListener('click', () => {
    buttonSound.play();
    difficulty = 'easy';
    timeLeft = 60;
    restart();
});

document.getElementById('hard-btn').addEventListener('click', () => {
    buttonSound.play();
    difficulty = 'hard';
    timeLeft = 45;
    restart();
});

document.querySelector(".timer").textContent = timeLeft;
document.querySelector(".score").textContent = score;

fetch('data/cards.json')
    .then((res) => res.json())
    .then((data) => {
        cards = [...data, ...data];
        shuffleCards();
        generateCards();
    });

    function shuffleCards() {
        let currentIndex = cards.length,
        randomIndex,
        temporaryValue;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = cards[currentIndex];
            cards[currentIndex] = cards[randomIndex];
            cards[randomIndex] = temporaryValue;
        }
    }

    function generateCards() {
        for (let card of cards) {
            const cardElement = document.createElement("div")
            cardElement.classList.add("card");
            cardElement.setAttribute("data-name", card.name);
            cardElement.innerHTML = `
            <div class="front">
            <img class="front-image" src="${card.image}" />
            </div>
            <div class="back"></div>
            `;
            gridContainer.appendChild(cardElement);
            cardElement.addEventListener("click", flipCard);
        }
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        clickSound.play();


        this.classList.add("flipped");
        
        if (!timeStarted) {
            timeStarted = true;
            document.getElementById("timer-container").style.display = "block";
            startTimer();
        }

        if (!firstCard) {
        firstCard = this;
        return;
    }

secondCard = this;
lockBoard = true;

if (firstCard.dataset.name === secondCard.dataset.name) {
    setTimeout(() => {
        matchSound.play();
    }, 350);
        score++;
        document.querySelector(".score").textContent = score;
        disableCards();
} else {
       unflipCards();
    setTimeout(() => {
       wrongSound.play();
    }, 350);
}

checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard();
    const allFlipped = document.querySelectorAll(".flipped").length === cards.length;
    if (allFlipped) {
        clearInterval(timeInterval);
        const winMessage = document.querySelector(".win-message");
        winMessage.style.display = "block";
        winMessage.classList.remove('popFromScreen');
        void winMessage.offsetWidth;
        winMessage.classList.add('popFromScreen');
        winSound.play();
        setTimeout(() => {
            winMessage.style.display="none";
            restart();
        }, 3000);
    }
        }

function unflipCards() {
    setTimeout(() => {

        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    }, 1000);
}

function resetBoard() {
    firstCard= null;
    secondCard = null;
    lockBoard = false;
}

function startTimer() {
    clearInterval(timeInterval);
    document.querySelector(".timer").textContent = timeLeft;

    timeInterval = setInterval(() => {
        timeLeft--;
        document.querySelector(".timer").textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timeInterval);

            loseSound.play()

            const gameOver = document.querySelector(".game-over-message");
            gameOver.style.display = "block";
            gameOver.classList.remove('popFromScreen');

            setTimeout(() => {
                gameOver.style.display = "none";
            restart();
            }, 3000);
        }
    }, 1000);
}

function restart() {
    buttonSound.play();
    document.querySelector('.win-message').style.display = "none";
    const winMessage = document.querySelector(".win-message");
    winMessage.style.display = "none";
    resetBoard();
    shuffleCards();
    score = 0;
    document.querySelector(".score").textContent = score;
    gridContainer.innerHTML = "";
    generateCards();

    clearInterval(timeInterval);
    timeStarted = false;
    document.getElementById("timer-container").style.display = "none";
}
