const express = require("express");
const Games = require("../../db/games.js");
const {
  GAME_CREATED,
  MAX_PLAYERS,
  GAME_STARTING,
  GAME_UPDATED,
} = require("../../../shared/constants.js");
const router = express.Router();

router.get("/", async (request, response) => {
  const { id: user_id } = request.session.user;

  try {
    const available_games = await Games.list(user_id);

    response.json(available_games);
  } catch (error) {
    console.log({ error });
    response.redirect("/lobby");
  }
});

router.get("/create", async (request, response) => {
  const { id: user_id } = request.session.user;
  const io = request.app.get("io");

  try {
    const { id: game_id } = await Games.create(user_id);

    io.emit(GAME_CREATED, { game_id });
    response.redirect(`/games/${game_id}`);
  } catch (error) {
    console.log({ error });
    response.redirect("/lobby");
  }
});

router.get("/:id/join", async (request, response) => {
  const { id: game_id } = request.params;
  const { id: user_id } = request.session.user;
  const io = request.app.get("io");

  try {
    await Games.join(game_id, user_id);
    await Games.updatePlayerCount(game_id);

    const { count } = await Games.countPlayers(game_id);

    response.redirect(`/games/${game_id}`);

    if (parseInt(count) === MAX_PLAYERS) {
      io.emit(GAME_STARTING, { id: game_id });

      const { connections, lookup } = await Games.state(parseInt(game_id));

      connections.forEach(({ user_id: connection_user_id, socket_id }) => {
        io.to(socket_id).emit(GAME_UPDATED, lookup(connection_user_id));
      });
    }
  } catch (error) {
    console.log({ error });
    response.redirect("/lobby");
  }
});

/*
router.get("/:id/start", async(request, response) => {
    //check if user is in game lobby and is host (user turn is true)

    //creates a new gameboard returning the id

    //redirects all players to new gameboard

    //Insert a card into the gameboard

    //Deal 7 cards to each player
}); 
*/

/*
router.get("/:id/draw", async(request, response) => {
    //check if user is in game

    //check if it is the user's turn`

    //draw a card
    
    //end turn
}); 
*/

router.post("/:id/play", async (request, response) => {
  const { color, number, uno_card_id, players } = request.body;
  const { id: game_id } = request.params;
  const { id: user_id } = request.session.user;
  const io = request.app.get("io");
  let currentPlayerID;
  let currentPlayerIndex;
  console.log({ user_id, game_id, color, number, uno_card_id, players});
  for(let i = 0; i < players.length; i++)
  {
    if(players[i].current_player)
    {
      currentPlayerID = players[i].id;
      currentPlayerIndex = i;
    }
  }
  response.status(200).send();
  //check if user is in game
  if(!await Games.checkValidPlayer(game_id, user_id))
  {
    console.log("Not a valid player")
    return -1;
  };

  //check if it is the user's turn
  if(!await Games.checkPlayerTurn(game_id, user_id))
  {
    console.log("Not player's turn")
    return -1;
  };

  //check if the card played is valid
  let discard_card_id = await Games.getDiscardCard(game_id);
  if(!await Games.checkValidCard(color, number, discard_card_id))
  {
    console.log("Not a valid card");
    return -1;
  }

  //play the card and remove from player's hand
  await Games.playCard(game_id, user_id, discard_card_id, uno_card_id);

  //check if player has 0 cards left in hand, they win and game is over
  if(!await Games.checkHandCount(game_id, user_id))
  {
    console.log("Player: " + user_id + " has cards left");
  };
  
  //Apply card effect and end turn

  // emit game updated message
});

module.exports = router;
