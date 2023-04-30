import { GAME_CREATED } from "../../shared/constants";

const gameList = document.querySelector("#game-list");
const itemTemplate = document.querySelector("#available-game-item");


export function createGameListItem(game_id){
    const entry = itemTemplate.content.cloneNode(true);

    entry.querySelector("a").setAttribute("href", `/api/games/${games.id}/join`);
    entry.querySelector("span").innerText = game_id;

    return entry
};

export function gameCreatedHandler(socket){
    socket.on(GAME_CREATED, ({ game_id}) => {

        gameList.appendChild(
            createGameListItem(game_id));
    });
};
