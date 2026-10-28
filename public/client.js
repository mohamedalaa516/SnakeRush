import { foodImage, snakeImages } from "./assets.js";
import { getBodyImage, getImage, drawBackground } from "./utils.js";
import { setupInput } from "./input.js";

const socket = io("http://localhost:3000", { transports: ["websocket"] });
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

setupInput(socket);

const gameResultLost = document.getElementById("lose-screen");
const lostScore = document.querySelector("#lose-screen #lose-score");
const losetRank = document.querySelector("#lose-screen #lose-rank");
const scoreNumber = document.getElementById("score-number");
const rankNumber = document.getElementById("rank-number");

let players = {};
let foods = [];
socket.on("players", (playersServer) => {
  players = playersServer.players;
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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground(ctx, canvas.width, canvas.height);

  if (Object.keys(players).length === 0) return;

  for (const [id, snake] of Object.entries(players)) {
    if (!snake || !snake.alive) continue;

    snake.body.forEach((component, index) => {
      if (index === 0) {
        let nameImage = getImage(snake.body[0], snake.body[1]);
        ctx.drawImage(
          snakeImages[`head_${nameImage}`],
          component.x,
          component.y,
          snake.size,
          snake.size,
        );
      } else if (index === snake.body.length - 1) {
        let nameImage = getImage(
          snake.body[snake.body.length - 1],
          snake.body[snake.body.length - 2],
        );
        ctx.drawImage(
          snakeImages[`tail_${nameImage}`],
          component.x,
          component.y,
          snake.size,
          snake.size,
        );
      } else {
        const prev = snake.body[index - 1];
        const next = snake.body[index + 1];
        const imageName = getBodyImage(prev, component, next);
        ctx.drawImage(
          snakeImages[imageName],
          component.x,
          component.y,
          snake.size,
          snake.size,
        );
      }
    });
  }

  for (let food of foods) {
    if (foodImage.complete && foodImage.naturalWidth > 0) {
      ctx.drawImage(foodImage, food.x, food.y, food.size * 3, food.size * 3);
    }
  }
}

function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();
