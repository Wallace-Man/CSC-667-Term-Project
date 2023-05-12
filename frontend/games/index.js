import events from "../../shared/constants";
import game_updated from "./updated";
import socket from "../common";

socket.on(events.GAME_UPDATED, game_updated);
socket.on(events.GAME_STARTING, (data) =>
  console.log(events.GAME_STARTING, { data })
);
