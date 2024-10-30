const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
};

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards",
};

const pathImages = "./src/assets/icons/";

const cardData = [
    { id: 0, name: "Blue Eyes White Dragon", type: "Fire", img: `${pathImages}Dragon.jpg`, WinOf: [2], LoseOf: [4] },
    { id: 1, name: "Dark Magician", type: "Holy", img: `${pathImages}Magician.jpg`, WinOf: [2, 4], LoseOf: [3] },
    { id: 2, name: "Exodia", type: "Death", img: `${pathImages}Exodia.jpg`, WinOf: [3], LoseOf: [0] },
    { id: 3, name: "Thousand Dragon", type: "Fire", img: `${pathImages}Dragao Milenar.jpg`, WinOf: [1], LoseOf: [2, 4] },
    { id: 4, name: "Summoned Skull", type: "Ice", img: `${pathImages}Rei Caveira.jpg`, WinOf: [0, 3], LoseOf: [2, 1] },
];

// Função para obter uma carta aleatória
async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

// Cria a imagem da carta no campo do jogador/computador
async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
        });

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    return cardImage;
}

// Exibe a carta selecionada e define os cards no campo
async function setCardsField(cardId) {
    await removeAllCardsImages();

    const computerCardId = await getRandomCardId();
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    await hiddenCardDetails();

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    const duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

// Oculta os detalhes das cartas
async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

// Exibe o botão com o texto do resultado do duelo
async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

// Atualiza o placar do jogador e do computador
async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

// Verifica os resultados do duelo entre o jogador e o computador
async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Draw";
    const playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "Win";
        state.score.playerScore++;
    } else if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "Lose";
        state.score.computerScore++;
    }

    await playAudio(duelResults);
    return duelResults;
}

// Remove todas as imagens de cartas no campo
async function removeAllCardsImages() {
    const { computerBox, player1Box } = state.playerSides;
    computerBox.querySelectorAll("img").forEach((img) => img.remove());
    player1Box.querySelectorAll("img").forEach((img) => img.remove());
}

// Exibe a carta selecionada para o jogador
async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
}

// Gera cartas para o jogador e computador
async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

// Reinicia o duelo
async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

// Toca o áudio correspondente ao resultado do duelo
async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    try {
        await audio.play();
    } catch (error) {
        console.error("Erro ao reproduzir o áudio:", error);
    }
}

// Inicializa o jogo com a música de fundo e o campo de cartas oculto
function init() {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm");
    if (bgm) {
        bgm.play();
    }
}

init();
