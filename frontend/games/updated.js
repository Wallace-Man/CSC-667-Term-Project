import md5 from "blueimp-md5";

const gameTable = document.querySelector("#game-area");
const playerTemplate = document.querySelector("#player-template");
const cardTemplate = document.querySelector("#card-template");

const discardArea = document.querySelector("#discard-area");

let initialized = false;

const initializeGameTable = (gameState) => {
  gameState.players.forEach(({ current_player, email, id, me, username }) => {
    const player = playerTemplate.content
      .cloneNode(true)
      .querySelector(".player");

    player.dataset.id = id;

    if (current_player) {
      player.classList.add("current-player");
    }
    if (me) {
      player.classList.add("its-a-me");
    }

    player.querySelector(
      ".gravatar img"
    ).src = `http://www.gravatar.com/avatar/${md5(email)}.png`;

    player.querySelector("span.name").innerText = username;

    gameTable.appendChild(player);
  });

  initialized = true;
};

const removeAllChildren = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

const updateDiscard = ({ card_color, card_number }) => {
  removeAllChildren(discardArea);

  const discardCard = cardTemplate.content
    .cloneNode(true)
    .querySelector(".card");

  discardCard.innerText = `DISCARD card_color: ${card_color}, card_number: ${card_number}`;

  discardArea.appendChild(discardCard);
};

const updatePlayers = (players, cards) => {
  players.forEach(({ id, me, current_player, card_count, username }) => {
    const player = document.querySelector(`.player[data-id="${id}"]`);
    const hand = player.querySelector(".hand");

    if (current_player) {
      player.querySelector(
        "span.name"
      ).innerText = `${username} (Current Player)`;
    } else {
      player.querySelector("span.name").innerText = username;
    }

    if (me) {
      removeAllChildren(hand);
      cards.forEach(({ card_color, card_number }) => {
        const element = cardTemplate.content
          .cloneNode(true)
          .querySelector(".card");

        element.innerText = `card_color: ${card_color}, card_number: ${card_number}`;
        hand.appendChild(element);
      });
    } else {
      hand.innerText = `${card_count} cards`;
    }
  });
};

const updated = (gameState) => {
  if (!initialized) {
    initializeGameTable(gameState);
  }

  const { discard_card, players, hand } = gameState;
  updateDiscard(discard_card);
  updatePlayers(players, hand);

  console.log({ gameState });
};

export default updated;
