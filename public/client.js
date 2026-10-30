import { foodImage, snakeImages } from "./assets.js";
import { getBodyImage, getImage, drawBackground } from "./utils.js";
import { setupInput } from "./input.js";

const socket = io("http://localhost:3000", { transports: ["websocket"] });
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

setupInput(socket);

function drawText(fontSize, fontColor, text, x, y) {
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = `${fontColor}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";

  ctx.fillText(text, x, y);
}
const gameResultLost = document.getElementById("lose-screen");
const lostScore = document.querySelector("#lose-screen #lose-score");
const losetRank = document.querySelector("#lose-screen #lose-rank");
const scoreNumber = document.getElementById("score-number");
const rankNumber = document.getElementById("rank-number");
const backToLobby = document.getElementById("lose-lobby");

let players = {};
let foods = [];

socket.on("connect", () => {
  socket.emit("player:join", {
    playerId: localStorage.getItem("playerId"),
    userName: localStorage.getItem("userName"),
  });
});
socket.on("players", (playersServer) => {
  players = playersServer;
});
socket.on("food:respwan", (foodsRespwan) => {
  foods = foodsRespwan;
});

socket.on("player:gameOver", (gameOver) => {
  if (gameOver) gameResultLost.style.display = "block";
});

socket.on("player:score", (score) => {
  lostScore.textContent = score;
  scoreNumber.textContent = score;
});

socket.on("player:rank", (rank) => {
  losetRank.textContent = rank;
  rankNumber.textContent = rank;
});
backToLobby.addEventListener("click", (event) => {
  socket.emit("backToLobby");
  window.location.href = "/";
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (Object.keys(players).length === 0) return;

  const myPlayer = players[socket.id];
  if (!myPlayer) return;
  ctx.fillStyle = "#20252b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  ctx.scale(myPlayer.camera.zoom || 1, myPlayer.camera.zoom || 1);
  ctx.translate(-myPlayer.camera.x, -myPlayer.camera.y);
  drawBackground(ctx, 2000, 800);

  for (let food of foods) {
    if (foodImage.complete && foodImage.naturalWidth > 0) {
      ctx.drawImage(foodImage, food.x, food.y, food.size * 3, food.size * 3);
    }
  }

  for (const [id, snake] of Object.entries(players)) {
    if (!snake || !snake.data.alive) continue;
    snake.data.body.forEach((component, index) => {
      if (index === 0) {
        let nameImage = getImage(snake.data.body[0], snake.data.body[1]);
        ctx.drawImage(
          snakeImages[`head_${nameImage}`],
          component.x,
          component.y,
          snake.data.size,
          snake.data.size,
        );
      } else if (index === snake.data.body.length - 1) {
        let nameImage = getImage(
          snake.data.body[snake.data.body.length - 1],
          snake.data.body[snake.data.body.length - 2],
        );
        ctx.drawImage(
          snakeImages[`tail_${nameImage}`],
          component.x,
          component.y,
          snake.data.size,
          snake.data.size,
        );
      } else {
        const prev = snake.data.body[index - 1];
        const next = snake.data.body[index + 1];
        const imageName = getBodyImage(prev, component, next);
        ctx.drawImage(
          snakeImages[imageName],
          component.x,
          component.y,
          snake.data.size,
          snake.data.size,
        );
      }
      drawText(
        20,
        "white",
        snake.userName,
        snake.data.body[0].x + snake.data.size / 2,
        snake.data.body[0].y - 10,
      );
    });
  }

  ctx.restore();
}

function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();
