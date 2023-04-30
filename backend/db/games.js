const db = require("./connection.js")

//const CREATE_GAME_SQL = "INSERT INTO games (completed) VALUES (false) RETURNING *";
const CREATE_GAME_SQL = "INSERT INTO games(closed, number_of_players) VALUES (false, 1) RETURNING id"
const INSERT_FIRST_USER_SQL = "INSERT INTO game_users(user_id, game_id, current_player) VALUES ($1, $2, true)"

const create = async(creator_id) => {
    const { id } = await db.one(CREATE_GAME_SQL)
    await db.none(INSERT_FIRST_USER_SQL, [creator_id, id])
    
    return { id };
}

const GAMES_LIST_SQL = `
  SELECT g.id FROM games g, game_users gu 
  WHERE g.id=gu.game_id AND gu.user_id != $1 AND 
  (SELECT COUNT(*) FROM game_users WHERE game_users.game_id=g.id) = 1
`;

const list = async(user_id) => db.any(GAMES_LIST_SQL, [user_id]);

const JOIN_GAME_SQL = "INSERT INTO game_users (game_id, user_id) VALUES ($1, $2)";
const join = (game_id, user_id) => { db.none(JOIN_GAME_SQL, [game_id, user_id]) };


module.exports = {create, list, join };