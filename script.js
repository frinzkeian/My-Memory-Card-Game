const matchSound = new Audio('assets/match.mp3');
 const clickSound = new Audio('assets/click.mp3');
        const wrongSound = new Audio('assets/wrong.mp3');
        const winSound = new Audio('assets/win.mp3');
        winSound.preload = 'auto';

const gridContainer = document.querySelector('.grid-container');
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score= 0;

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

        if (!firstCard) {
        firstCard = this;
        return;
    }

secondCard = this;
score++;
document.querySelector(".score").textContent = score;
lockBoard = true;

let isMatch= firstCard.dataset.name === secondCard.dataset.name;
if (isMatch) matchSound.play();
else wrongSound.play();

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
        const winMessage = document.querySelector(".win-message");
        winMessage.style.display = "block";
        winMessage.classList.remove('popFromScreen');
        void winMessage.offsetWidth;
        winMessage.classList.add('popFromScreen');
        winSound.play();
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

function restart() {
    document.querySelector('.win-message').style.display = "none";
    const winMessage = document.querySelector(".win-message");
    winMessage.style.display = "none";
    resetBoard();
    shuffleCards();
    score = 0;
    document.querySelector(".score").textContent = score;
    gridContainer.innerHTML = "";
    generateCards();
}
