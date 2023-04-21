const express = require("express");
const bcrypt = require("bcrypt");
const Users = require("../../db/users.js");

const router = express.Router();

const SALT_ROUNDS = 10;

router.get("/sign-up", (request, response) => {
    response.render("sign-up", {
        title: "Sign Up",
        message: "Our first template.",
      });
})

router.post("/sign-up", async (request, response) => {
  const { username, email, password} = request.body;

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);

  try{
    const { id } = await Users.create(username, email, hash);
    request.session.user = {id, username, email,};

    response.redirect("/");
  }catch(error){
    console.log({ error });
    response.redirect("/");
  }
});

router.get("/login", (request, response) => {
    response.render("login", {
        title: "Login",
        message: "Our first template.",
      });
})

router.post("/login", async (request, response) => {
  const {username, password } = request.body;

  if(Users.findByUser(username)){console.log("Found one!!!");}
  try {
    const { id, email, password: hash } = await Users.findByUser(username);
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash2 = await bcrypt.hash(password, salt);
    const isValidUser = hash2.localeCompare(hash);
    if (isValidUser) {
      request.session.user = {
        id,
        username,
        email
      };

      response.redirect("/");
    } else {
      throw "Credentials invalid";
    }
  } catch (error) {
    console.log({ error });

    response.render("login", { title: "TeamQ Term Project", username });
  }
});

router.get("/logout", (request, response) => {
  request.session.destroy((error) => {
    console.log({ error });
  });

  response.redirect("/");
});

module.exports = router;