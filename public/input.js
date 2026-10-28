export function setupInput(socket) {
  const directionPlayer = { up: false, down: false, right: false, left: false };

  document.addEventListener("keydown", (event) => {
    directionPlayer.up = false;
    directionPlayer.down = false;
    directionPlayer.right = false;
    directionPlayer.left = false;

    if (event.code === "KeyW") directionPlayer.up = true;
    else if (event.code === "KeyS") directionPlayer.down = true;
    else if (event.code === "KeyD") directionPlayer.right = true;
    else if (event.code === "KeyA") directionPlayer.left = true;

    socket.emit("player:dir", directionPlayer);
  });
}
