require("dotenv").config();
const homeRoutes = require("./routes/static/home.js");
const gamesRoutes = require("./routes/static/games.js");
const lobbyRoutes = require("./routes/static/lobby.js");
const authenticationRoutes = require("./routes/static/authentication.js");
const chatRoutes = require("./routes/static/chat.js");
const testRoutes = require("./routes/test/index.js");
const apiGamesRoutes = require("./routes/api/games.js")

const express = require("express");
const morgan = require("morgan");
const path = require("path");
const createError = require("http-errors");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const cookieParser = require("cookie-parser");
const initSockets = require("./sockets/init.js");
const db = require("./db/connection.js");

const app = express();

//app.use("/test", testRoutes);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const sessionMiddleware = session({
  store: new pgSession({ pgPromise: db }),
  secret: "teamqUNO",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
});

app.use(sessionMiddleware);
const server = initSockets(app, sessionMiddleware);

if (process.env.NODE_ENV === "development") {
    const livereload = require("livereload");
    const connectLiveReload = require("connect-livereload");
  
    const liveReloadServer = livereload.createServer();
    liveReloadServer.watch(path.join(__dirname, "backend", "static"));
    liveReloadServer.server.once("connection", () => {
      setTimeout(() => {
        liveReloadServer.refresh("/");
      }, 100);
    });
  
    app.use(connectLiveReload());
  }

const PORT = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "", "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "", "static")));

const rootRoutes = require("../backend/routes/root");

app.use("/", homeRoutes);
app.use("/games", isAuthenticated, gamesRoutes);
app.use("/api/games", isAuthenticated, apiGamesRoutes);
app.use("/lobby", isAuthenticated, lobbyRoutes);
app.use("/authentication", authenticationRoutes);
app.use("/chat", chatRoutes);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.use((request, response, next) => {
    next(createError(404));
  });