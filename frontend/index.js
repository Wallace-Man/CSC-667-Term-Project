import io from "socket.io-client";
import events from "../backend/sockets/constants";
import { gameCreatedHandler } from "./games/created";

const socket = io();
gameCreatedHandler(socket);

const messageContainer = document.querySelector("#messages");

// This socket call is different than from what the prof had in his lecture 4/24
// Timestamp 55 mins
socket.on("chat-message", ({ message, sender }) => {
  console.log({ message, sender });

  const display = document.createElement("div");
  const name = document.createElement("span");
  name.innerText = sender;

  const thing = document.createElement("div");
  thing.innerText = message;

  display.appendChild(name);
  display.appendChild(thing);

  messageContainer.append(display);
});

document
  .querySelector("input#chatMessage")
  .addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
      const message = event.target.value;
      event.target.value = "";

      fetch("/chat/0", {
        method: "post",
        body: JSON.stringify({ message }),
        headers: { "Content-Type": "application/json" },
      });
    }
  });

