class Camera {
  constructor(x, y, width, height, zoom) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.zoom = zoom;
  }
  update(player) {
    const playerCenterX = player.newHead.x + player.size / 2;
    const playerCenterY = player.newHead.y + player.size / 2;

    this.x = playerCenterX - this.width / (2 * this.zoom);
    this.y = playerCenterY - this.height / (2 * this.zoom);
  }
}

module.exports = Camera;
