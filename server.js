const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const Player = require("./src/player");
const Food = require("./src/food.js");
const Camera = require("./src/camera.js");
const path = require("path");
//create socket and server
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 3000;

const screenGame = {
  width: 2000,
  height: 800,
};
let players = new Map();
let playerSockets = new Map();
let food = new Food(30, screenGame);
food.createFoods();

io.on("connection", (socket) => {
  socket.on("player:join", ({ playerId, userName }) => {
    if (!playerId || !userName) return;
    let player = players.get(playerId);
    if (!player) {
      player = {
        data: new Player(20, 15, screenGame),
        camera: new Camera(0, 0, screenGame.width, screenGame.height, 2),
        socketId: null,
        userName: userName,
      };
      players.set(playerId, player);
    }
    player.socketId = socket.id;
    playerSockets.set(socket.id, playerId);
  });
  socket.on("player:dir", (direction) => {
    const playerId = playerSockets.get(socket.id);
    if (!playerId) return;
    const player = players.get(playerId);
    if (player.data.alive) {
      player.data.dir = direction;
    }
  });
  socket.on("backToLobby", () => {
    const playerId = playerSockets.get(socket.id);
    if (!playerId) return;
    players.delete(playerId);
  });
  socket.on("disconnect", () => {
    const playerId = playerSockets.get(socket.id);
    if (!playerId) return;
    const player = players.get(playerId);
    if (player && player.socketId == socket.id) {
      player.socketId = null;
    }
    playerSockets.delete(socket.id);
  });
});
setInterval(() => {
  const rank = {};

  for (const [playerId, player] of players.entries()) {
    if (!player.socketId) continue;

    if (player.data.gameOver) {
      io.to(player.socketId).emit("player:gameOver", player.data.gameOver);
    }
    if (player.data.alive) {
      player.data.update(food);
      player.camera.update(player.data);

      io.to(player.socketId).emit("player:score", player.data.score);

      rank[player.socketId] = player.data.score;
    }
  }

  Object.entries(rank)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .forEach(([socketId], index) => {
      io.to(socketId).emit("player:rank", index + 1);
    });
  const playersData = {};

  for (const [playerId, player] of players.entries()) {
    if (!player.socketId) continue;

    playersData[player.socketId] = {
      data: {
        body: player.data.body,
        size: player.data.size,
        alive: player.data.alive,
        score: player.data.score,
      },
      camera: {
        x: player.camera.x,
        y: player.camera.y,
        zoom: player.camera.zoom,
      },
      userName: player.userName,
    };
  }

  io.emit("players", playersData);
  io.emit("food:respwan", food.foodList);
}, 60);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "menu.html"));
});
app.use(express.static("./public"));
httpServer.listen(PORT, () => {
  console.log(` Server is listening to port ${PORT}`);
});
