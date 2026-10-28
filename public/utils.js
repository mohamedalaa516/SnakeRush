export function getBodyImage(prev, cur, next) {
  const prevDx = prev.x - cur.x;
  const prevDy = prev.y - cur.y;
  const nextDx = next.x - cur.x;
  const nextDy = next.y - cur.y;

  if ((prevDx !== 0 && nextDy !== 0) || (prevDy !== 0 && nextDx !== 0)) {
    if ((prevDy < 0 && nextDx < 0) || (nextDy < 0 && prevDx < 0))
      return "body_topleft";
    if ((prevDy < 0 && nextDx > 0) || (nextDy < 0 && prevDx > 0))
      return "body_topright";
    if ((prevDy > 0 && nextDx < 0) || (nextDy > 0 && prevDx < 0))
      return "body_bottomleft";
    if ((prevDy > 0 && nextDx > 0) || (nextDy > 0 && prevDx > 0))
      return "body_bottomright";
  }
  return prev.x !== next.x ? "body_horizontal" : "body_vertical";
}

export function getImage(nextBody, prevBody) {
  if (prevBody.x > nextBody.x) return "left";
  if (prevBody.x < nextBody.x) return "right";
  if (prevBody.y > nextBody.y) return "up";
  if (prevBody.y < nextBody.y) return "down";
}

export function drawBackground(ctx, width, height) {
  let cellSize = 20;
  for (let x = 0; x < width; x += cellSize) {
    for (let y = 0; y < height; y += cellSize) {
      ctx.fillStyle =
        (Math.floor(x / cellSize) + Math.floor(y / cellSize)) % 2 === 0
          ? "#A8D948"
          : "#B8E65C";
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  }
}
