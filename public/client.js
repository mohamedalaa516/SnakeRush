const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

function getBodyImage(prev, cur, next) {
  const prevDx = prev.x - cur.x;
  const prevDy = prev.y - cur.y;

  const nextDx = next.x - cur.x;
  const nextDy = next.y - cur.y;

  if ((prevDx !== 0 && nextDy !== 0) || (prevDy !== 0 && nextDx !== 0)) {
    if ((prevDy < 0 && nextDx < 0) || (nextDy < 0 && prevDx < 0)) {
      return "body_topleft";
    }

    if ((prevDy < 0 && nextDx > 0) || (nextDy < 0 && prevDx > 0)) {
      return "body_topright";
    }

    if ((prevDy > 0 && nextDx < 0) || (nextDy > 0 && prevDx < 0)) {
      return "body_bottomleft";
    }

    if ((prevDy > 0 && nextDx > 0) || (nextDy > 0 && prevDx > 0)) {
      return "body_bottomright";
    }
  }
  return prev.x !== next.x ? "body_horizontal" : "body_vertical";
}
function getImage(next, prev) {
  const nextBody = snake.body[next];
  const prevBody = snake.body[prev];
  if (prevBody.x > nextBody.x) {
    return "left";
  } else if (prevBody.x < nextBody.x) {
    return "right";
  } else if (prevBody.y > nextBody.y) {
    return "up";
  } else if (prevBody.y < nextBody.y) {
    return "down";
  }
}
let snake = {};
let foods = [];
let directionPlayer = {
  up: false,
  down: false,
  right: false,
  left: false,
};
const foodImage = new Image();
foodImage.src = "assets/apple.png";

const snakeImage = {};

const imagesName = [
  "head_right.png",
  "head_up.png",
  "head_down.png",
  "head_left.png",
  "body_horizontal.png",
  "body_vertical.png",
  "tail_left.png",
  "tail_right.png",
  "tail_up.png",
  "tail_down.png",
  "body_bottomleft.png",
  "body_bottomright.png",
  "body_topleft.png",
  "body_topright.png",
];

for (const imageName of imagesName) {
  const image = new Image();
  image.src = `assets/player/${imageName}`;
  const key = imageName.replace(".png", "");
  snakeImage[key] = image;
}
let headDirection = "right";
let tailDirection = "left";
document.addEventListener("keydown", (event) => {
  directionPlayer.up = false;
  directionPlayer.down = false;
  directionPlayer.right = false;
  directionPlayer.left = false;
  if (event.code === "KeyW") {
    directionPlayer.up = true;
  } else if (event.code === "KeyS") {
    directionPlayer.down = true;
  } else if (event.code === "KeyD") {
    directionPlayer.right = true;
  } else if (event.code === "KeyA") {
    directionPlayer.left = true;
  }
  socket.emit("player:dir", directionPlayer);
});
socket.on("player:pos", (pos) => {
  ((snake.body = pos.body), (snake.speed = pos.speed), (snake.size = pos.size));
});
socket.on("food:respwan", (foodsRespwan) => {
  foods = foodsRespwan;
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!snake.body) return;
  for (const [index, component] of snake.body.entries()) {
    if (index == 0) {
      let nameImage = getImage([0], [1]);
      ctx.drawImage(
        snakeImage[`head_${nameImage}`],
        component.x,
        component.y,
        snake.size,
        snake.size,
      );
    } else if (index == snake.body.length - 1) {
      let nameImage = getImage(
        [snake.body.length - 1],
        [snake.body.length - 2],
      );
      ctx.drawImage(
        snakeImage[`tail_${nameImage}`],
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
        snakeImage[imageName],
        component.x,
        component.y,
        snake.size,
        snake.size,
      );
    }
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
