const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score-points")
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        player: "player-cards",
        playerBox: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards")
    },
    button: document.getElementById("next-duel"),
    bgm: document.getElementById("bgm"),
}


const path = "./src/assets/icons/";


const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        image: `${path}dragon.png`,
        winOf: [1],
        loseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        image: `${path}magician.png`,
        winOf: [2],
        loseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        image: `${path}exodia.png`,
        winOf: [0],
        loseOf: [1],
    }
];

async function getRandomId() {
    return randomId = Math.floor(Math.random() * cardData.length);
}


async function drawSelectedCard(cardId) {
    state.cardSprites.avatar.src = cardData[cardId].image;
    state.cardSprites.name.innerText = cardData[cardId].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[cardId].type;
}

async function removeAllCardsImages() {
    let { computerBox, playerBox } = state.playerSides;
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => {
        img.remove();
    });

    cards = playerBox;
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => {
        img.remove();
    });
}

async function checkDuelResult(playerCardId, computerId) {
    let duelResult = 'draw';

    if (cardData[playerCardId].winOf.includes(computerId)) {
        duelResult = "win";
        state.score.playerScore++;
    }

    if (cardData[playerCardId].loseOf.includes(computerId)) {
        duelResult = "lose";
        state.score.computerScore++;
    }

    playAudio(duelResult)
    return duelResult;
}

async function drawButton(text) {
    state.button.innerText = text.toUpperCase();
    state.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function playAudio(audioName) {
    let audio = new Audio(`./src/assets/audios/${audioName}.wav`)

    try {
        audio.play();
    } catch {

    }
}

async function ShowCardsInfield(value)
{
    let toHide = value ? "block" : "none";

    state.fieldCards.player.style.display = toHide;
    state.fieldCards.computer.style.display = toHide;
}


async function setCardField(cardId) {
    await removeAllCardsImages();
    let computerCard = await getRandomId();

    await ShowCardsInfield(true);

    state.fieldCards.player.src = cardData[cardId].image;
    state.fieldCards.computer.src = cardData[computerCard].image;

    let result = await checkDuelResult(cardId, computerCard);

    await updateScore();
    await drawButton(result);
};

async function creatCardImage(cardId, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", cardId);
    cardImage.classList.add("card");

    if (fieldSide === state.playerSides.player) {

        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(cardId);
        })

        cardImage.addEventListener("click", () => {
            setCardField(cardId);
        });
    }

    return cardImage;
}

async function drawnCards(cardNumber, fieldSide) {
    for (let i = 0; i < cardNumber; i++) {
        const randomId = await getRandomId();
        const cardImage = await creatCardImage(randomId, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.button.style.display = "none";

    ShowCardsInfield(false);

    init();
}

function playBgm() {
    state.bgm.play();
}

function init() {
    drawnCards(5, state.playerSides.player);
    drawnCards(5, state.playerSides.computer);

    playBgm();
}

init();