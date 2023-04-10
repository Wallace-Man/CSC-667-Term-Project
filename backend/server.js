const homeRoutes = require("./routes/static/home.js");
const gamesRoutes = require("./routes/static/games.js");
const lobbyRoutes = require("./routes/static/lobby.js");
const authenticationRoutes = require("./routes/static/authentication.js");

const path = require("path");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const express = require("express");
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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
app.use("/games", gamesRoutes);
app.use("/lobby", lobbyRoutes);
app.use("/authentication", authenticationRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.use((request, response, next) => {
    next(createError(404));
  });