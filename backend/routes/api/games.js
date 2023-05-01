const express = require("express");
const Games = require("../../db/games.js");
const { GAME_CREATED } = require("../../../shared/constants.js");
const router = express.Router();

router.get("/", async(request, response) => {
    const {id: user_id} = request.session.user;

    try{
        const available_games = await Games.list(user_id);

        response.json(available_games);
    }
    catch(error){
        console.log({ error });
        response.redirect("/lobby");
    }
})

router.get("/create", async(request, response) => {
    const { id: user_id } = request.session.user;
    const io = request.app.get("io");
    try{
        const { id: game_id } = await Games.create(user_id);

        io.emit(GAME_CREATED, { game_id });
        response.redirect(`/games/${game_id}`);
    }
    catch(error){
        console.log({ error});
        response.redirect("/lobby");
    }
})

router.get("/:id/join", async(request, response) => {
    const { id: game_id } = request.params;
    const { id: user_id } = request.session.user;
    try{
        await Games.join(game_id, user_id);
        response.redirect(`/games/${game_id}`);
    }catch(error){
        console.log({error});
        response.redirect("/lobby");
    }
});

module.exports = router;