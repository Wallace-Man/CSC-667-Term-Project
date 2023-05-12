const express = require("express");
const router = express.Router();

router.get("/:id", (request, response) => {
  const { id } = request.params;

  response.render("games", {
    id,
    title: "Game",
    message: "Our first template.",
  });
});

module.exports = router;
