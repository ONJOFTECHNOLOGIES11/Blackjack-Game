let deck = [];
let playerCards = [];
let dealerCards = [];
let playerScore = 0;
let dealerScore = 0;

const playerCardsElement = document.getElementById("playerCards");
const dealerCardsElement = document.getElementById("dealerCards");
const playerScoreElement = document.getElementById("playerScore");
const dealerScoreElement = document.getElementById("dealerScore");
const messageElement = document.getElementById("message");
const hitBtn = document.getElementById("hitBtn");
const standBtn = document.getElementById("standBtn");
const resetBtn = document.getElementById("resetBtn");

function initializeDeck() {
    const suits = ["hearts", "diamonds", "clubs", "spades"];
    const values = [
        "2", "3", "4", "5", "6", "7", "8", "9", "10",
        "J", "Q", "K", "A"
    ];
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    deck = shuffle(deck);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startGame() {
    initializeDeck();
    playerCards = [drawCard(), drawCard()];
    dealerCards = [drawCard(), drawCard()];
    playerScore = calculateScore(playerCards);
    dealerScore = calculateScore(dealerCards);
    updateUI();
    checkForBlackjack();
}

function drawCard() {
    return deck.pop();
}

function calculateScore(cards) {
    let score = 0;
    let hasAce = false;
    for (let card of cards) {
        if (card.value === "J" || card.value === "Q" || card.value === "K") {
            score += 10;
        } else if (card.value === "A") {
            hasAce = true;
            score += 11;
        } else {
            score += parseInt(card.value);
        }
    }
    if (hasAce && score > 21) {
        score -= 10;
    }
    return score;
}

function updateUI() {
    playerCardsElement.innerHTML = "";
    dealerCardsElement.innerHTML = "";
    for (let card of playerCards) {
        playerCardsElement.innerHTML += `<div>${card.value}</div>`;
    }
    for (let card of dealerCards) {
        dealerCardsElement.innerHTML += `<div>${card.value}</div>`;
    }
    playerScoreElement.innerText = `Score: ${playerScore}`;
    dealerScoreElement.innerText = `Score: ${dealerScore}`;
}

function checkForBlackjack() {
    if (playerScore === 21) {
        messageElement.innerText = "Blackjack! You win!";
        disableButtons();
    } else if (dealerScore === 21) {
        messageElement.innerText = "Dealer has Blackjack! You lose!";
        disableButtons();
    }
}

function disableButtons() {
    hitBtn.disabled = true;
    standBtn.disabled = true;
}

function enableButtons() {
    hitBtn.disabled = false;
    standBtn.disabled = false;
}

hitBtn.addEventListener("click", function() {
    playerCards.push(drawCard());
    playerScore = calculateScore(playerCards);
    updateUI();
    if (playerScore > 21) {
        messageElement.innerText = "You bust! Dealer wins!";
        disableButtons();
    }
});

standBtn.addEventListener("click", function() {
    while (dealerScore < 17) {
        dealerCards.push(drawCard());
        dealerScore = calculateScore(dealerCards);
    }
    updateUI();
    if (dealerScore > 21) {
        messageElement.innerText = "Dealer busts! You win!";
    } else if (dealerScore > playerScore) {
        messageElement.innerText = "Dealer wins!";
    } else if (dealerScore < playerScore) {
        messageElement.innerText = "You win!";
    } else {
        messageElement.innerText = "It's a tie!";
    }
    disableButtons();
});

resetBtn.addEventListener("click", function() {
    startGame();
    messageElement.innerText = "";
    enableButtons();
});

startGame();
