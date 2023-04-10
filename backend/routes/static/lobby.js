const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
    response.render("lobby", {
        title: "Lobby",
        message: "Our first template.",
      });
})

module.exports = router;