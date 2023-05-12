const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
  response.render("home", {
    title: "Hi World!",
    message: "Our first tmplate.",
  });
});

module.exports = router;
