import md5 from "blueimp-md5";

const deckArea = document.querySelector("#deck-area");
const playerArea = document.querySelector("#player-area");
const playerTemplate = document.querySelector("#player-template");
const cardTemplate = document.querySelector("#card-template");

const discardArea = document.querySelector("#discard-area");

let initialized = false;

const createCard = (color, number, uno_card_id) => {
  const card = cardTemplate.content.cloneNode(true).querySelector(".card");
  card.dataset.color = color;
  card.dataset.number = number;
  card.dataset.uno_card_id = uno_card_id
  card.classList.add(`color-${color}`, `number-${number}`);

  return card;
};

const initializeGameTable = (gameState) => {
  const { game_id } = gameState;

  deckArea.appendChild(createCard("-99", "-99"));
  
  gameState.players.forEach(({ current_player, email, id, me, username }) => {
    const player = playerTemplate.content
      .cloneNode(true)
      .querySelector(".player");

    player.dataset.id = id;

    if (current_player) {
      player.classList.add("current-player");
    }
    if (me) 
    {
      player.classList.add("its-a-me");

      player.querySelector(".hand").addEventListener("click", (event) => 
      {
        if (!event.target.classList.contains("card") || !current_player) {
          return;
        }
        
        const requestBody = {...event.target.dataset, players: gameState.players, gameboard: gameState.gameboard}

        fetch(`/api/games/${game_id}/play`, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
      });

      deckArea.addEventListener("click", (event) => 
      {
        if (!current_player) {
          return;
        }

        const requestBody = {players: gameState.players, gameboard: gameState.gameboard}

        fetch(`/api/games/${game_id}/draw`, 
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
      });
    }

    player.querySelector(
      ".gravatar img"
    ).src = `http://www.gravatar.com/avatar/${md5(email)}.png?s=40`;

    player.querySelector("span.name").innerText = username;

    playerArea.appendChild(player);
  });

  

  initialized = true;
};

const removeAllChildren = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

const updateDiscard = ({ card_color, card_number, uno_card_id }) => {
  removeAllChildren(discardArea);

  discardArea.appendChild(createCard(card_color, card_number, uno_card_id));
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

    if (current_player) {
      player.classList.add("current-player");
    }
    else {
      player.classList.remove("current-player");
    }

    if (me) {
      removeAllChildren(hand);
      cards.forEach(({ card_color, card_number, uno_card_id }) => {
        hand.appendChild(createCard(card_color, card_number, uno_card_id));
      });
    } else {
      removeAllChildren(hand);
      for (let i = 0; i < card_count; i++) {
        hand.appendChild(createCard("-99", "-99"));
      }
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
