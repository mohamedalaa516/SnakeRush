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
let player = new Player(20, 20);
let food = new Food(40, screenGame);
food.createFoods();

io.on("connection", (socket) => {
  socket.on("player:dir", (direction) => {
    player.dir = direction;
  });
  socket.on("disconnect", () => {
    console.log("player disconnect:", socket.id);
  });
});
setInterval(() => {
  player.update(food);
  io.emit("food:respwan", food.foodList);
  io.emit("player:pos", {
    body: player.body,
    size: player.size,
    speed: player.speed,
  });
}, 150);

app.use(express.static("./public"));
httpServer.listen(PORT, () => {
  console.log(` Server is listening to port ${PORT}`);
});
