const express = require("express");
const router = express.Router();

router.get("/sign-up", (request, response) => {
    response.render("sign-up", {
        title: "Sign Up",
        message: "Our first template.",
      });
})

router.get("/login", (request, response) => {
    response.render("login", {
        title: "Login",
        message: "Our first template.",
      });
})

module.exports = router;