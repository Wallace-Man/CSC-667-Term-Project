const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
    response.render("home", {
        title: "Home",
        message: "Our first template.",
      });
})

router.get("/logout", (request, response) => {
  request.session.destroy((error) => {
      console.log({ error });
    });
  response.redirect("/");
})

module.exports = router;