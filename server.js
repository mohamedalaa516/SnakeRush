const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const Player = require("./src/player");
const Food = require("./src/food.js");

//create socket and server
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 3000;

const screenGame = {
  width: 1280,
  height: 600,
};
let players = {};
let food = new Food(20, screenGame);
food.createFoods();

io.on("connection", (socket) => {
  players[socket.id] = new Player(20, 20, screenGame);
  socket.on("player:dir", (direction) => {
    players[socket.id].dir = direction;
  });
  socket.on("disconnect", () => {
    console.log("player disconnect:", socket.id);
    if (players[socket.id]) {
      delete players[socket.id];
    }
  });
});
setInterval(() => {
  rank = {};
  for (const [socketId, player] of Object.entries(players)) {
    if (player.gameOver) {
      io.to(socketId).emit("player:gameOver", player.gameOver);
    }
    if (player.alive) {
      player.update(food);
      io.to(socketId).emit("player:score", player.score);
      rank[socketId] = player.score;
    }
  }
  Object.entries(rank)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .forEach(([socketId], index) => {
      io.to(socketId).emit("player:rank", index + 1);
    });
  io.emit("food:respwan", food.foodList);
  io.emit("players", {
    players,
  });
}, 150);

app.use(express.static("./public"));
httpServer.listen(PORT, () => {
  console.log(` Server is listening to port ${PORT}`);
});
