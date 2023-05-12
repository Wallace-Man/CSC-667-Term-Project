const http = require("http");
const { Server } = require("socket.io");
const Sockets = require("../db/sockets");
const Games = require("../db/games");
const { GAME_UPDATED } = require("../../shared/constants");

const initSockets = (app, sessionMiddleware) => {
  const server = http.createServer(app);
  const io = new Server(server);

  io.engine.use(sessionMiddleware);

  io.on("connection", (socket) => {
    let game_id = socket.handshake.query.path.substring(1);
    let user_id = 0
    if (game_id === "lobby") {
      game_id = 0;
      user_id = socket.request.session.user.id;
    }
    else if(typeof game_id === "string") {
      game_id = 0;
    } else {
      game_id = parseInt(game_id.substring(game_id.lastIndexOf("/") + 1));
      user_id = socket.request.session.user.id;
    }

    if(user_id != 0)
    {
      Sockets.add(game_id, user_id, socket.id);
    }
     
    if (game_id !== 0) {
      Games.state(game_id).then(({ lookup }) => {
        socket.emit(GAME_UPDATED, lookup(user_id));
      });
    }
  });

  app.set("io", io);

  return server;
};

module.exports = initSockets;
