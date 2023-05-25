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


router.post("/:id/draw", async(request, response) => {
  const { players, gameboard } = request.body;
  const { id: game_id } = request.params;
  const { id: user_id } = request.session.user;
  const io = request.app.get("io");
  for(let i = 0; i < players.length; i++)
  {
    if(players[i].current_player)
    {
      currentPlayerID = players[i].id;
      currentPlayerIndex = i;
    }
  }
  console.log(players, gameboard);
  //response.status(200).send();
  //check if user is in game
  if(!await Games.checkValidPlayer(game_id, user_id))
  {
    console.log("Not a valid player")
    return -1;
  };

  //check if it is the user's turn`
  if(currentPlayerID != user_id)
  {
    return -1;
  }

  //draw a card
  Games.drawCard(game_id, user_id);

  //end turn
  let nextPlayerIndex = Games.getNextPlayerIndex(currentPlayerIndex, players.length, gameboard.clockwise);
  Games.updatePlayerTurnFalse(game_id, user_id);
  Games.updatePlayerTurnTrue(game_id, players[nextPlayerIndex].id);
  //emit gamestate
  const { connections, lookup } = await Games.state(game_id);

  connections.forEach(({ user_id: connection_user_id, socket_id }) => {
    io.to(socket_id).emit(GAME_UPDATED, lookup(connection_user_id));
  });
}); 


router.post("/:id/play", async (request, response) => {
  const { color, number, uno_card_id, players, gameboard } = request.body;
  const { id: game_id } = request.params;
  const { id: user_id } = request.session.user;
  const io = request.app.get("io");
  console.log({ user_id, game_id, color, number, uno_card_id, players, gameboard});
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
    return;
  };


  if(currentPlayerID != user_id)
  {
    return;
  }

  //check if the card played is valid
  let discard_card_id = await Games.getDiscardCard(game_id);

  if(!await Games.checkValidCard(color, number, gameboard.board_color, gameboard.board_number))
  {
    console.log("Not a valid card");
    return;
  }

  //play the card and remove from player's hand
  await Games.playCard(game_id, user_id, discard_card_id, uno_card_id);

  //check if player has 0 cards left in hand, they win and game is over
  if(!await Games.checkHandCount(game_id, user_id))
  {
  };
  
  //Apply card effect and end turn
  let nextPlayerIndex;
  let randomColorNumber;
  switch(number)
  {
    case "10":
      console.log("AT CASE 10");
      nextPlayerIndex = Games.getNextPlayerIndex(currentPlayerIndex + 1, players.length, gameboard.clockwise);
      Games.updatePlayerTurnFalse(game_id, user_id);
      Games.updatePlayerTurnTrue(game_id, players[nextPlayerIndex].id);
      Games.updateGameColorAndNumber(color, number, game_id);
      break;
    case "11":
      console.log("AT CASE 11");
      nextPlayerIndex = Games.getNextPlayerIndex(currentPlayerIndex, players.length, !gameboard.clockwise);
      Games.updateGameDirection(game_id, gameboard.clockwise);
      Games.updatePlayerTurnFalse(game_id, user_id);
      Games.updatePlayerTurnTrue(game_id, players[nextPlayerIndex].id);
      Games.updateGameColorAndNumber(color, number, game_id);
      break;
    case "12":
      console.log("AT CASE 12");
      nextPlayerIndex = Games.getNextPlayerIndex(currentPlayerIndex, players.length, gameboard.clockwise);
      Games.playPlusTwoCard(game_id, players[nextPlayerIndex].id);
      nextPlayerIndex = Games.getNextPlayerIndex(currentPlayerIndex + 1, players.length, gameboard.clockwise);
      Games.updatePlayerTurnFalse(game_id, user_id);
      Games.updatePlayerTurnTrue(game_id, players[nextPlayerIndex].id);
      Games.updateGameColorAndNumber(color, number, game_id);
      break;
    case "13":
      console.log("AT CASE 13");
      nextPlayerIndex = Games.getNextPlayerIndex(currentPlayerIndex, players.length, gameboard.clockwise);
      Games.updatePlayerTurnFalse(game_id, user_id);
      Games.updatePlayerTurnTrue(game_id, players[nextPlayerIndex].id);
      randomColorNumber = Math.floor(Math.random() * 4) + 1;
      Games.updateGameColorAndNumber(randomColorNumber, number, game_id);
      break;
    case "14":
      console.log("AT CASE 14");
      nextPlayerIndex = Games.getNextPlayerIndex(currentPlayerIndex, players.length, gameboard.clockwise);
      Games.playPlusFourCard(game_id, players[nextPlayerIndex].id);
      nextPlayerIndex = Games.getNextPlayerIndex(currentPlayerIndex + 1, players.length, gameboard.clockwise);
      Games.updatePlayerTurnFalse(game_id, user_id);
      Games.updatePlayerTurnTrue(game_id, players[nextPlayerIndex].id);
      randomColorNumber = Math.floor(Math.random() * 4) + 1;
      Games.updateGameColorAndNumber(randomColorNumber, number, game_id);
      break;
    default:
      console.log("AT CASE DEFAULT");
      nextPlayerIndex = Games.getNextPlayerIndex(currentPlayerIndex, players.length, gameboard.clockwise);
      Games.updatePlayerTurnFalse(game_id, user_id);
      Games.updatePlayerTurnTrue(game_id, players[nextPlayerIndex].id);
      Games.updateGameColorAndNumber(color, number, game_id);
      break;
  }

  // emit game updated message
  const { connections, lookup } = await Games.state(game_id);

  connections.forEach(({ user_id: connection_user_id, socket_id }) => {
    io.to(socket_id).emit(GAME_UPDATED, lookup(connection_user_id));
  });

});

module.exports = router;
