const {
  isColliding,
  isCollidingWithWall,
  isCollidingHead,
} = require("./helperFunction.js");
class Player {
  constructor(size, speed, screen) {
    this.body = [
      { x: 100, y: 100 }, // Head
      { x: 80, y: 100 }, // Body
      { x: 60, y: 100 }, // Tail
    ];
    this.size = size;
    this.speed = speed;
    this.eatFood = false;
    this.dir = {
      up: false,
      down: false,
      right: true,
      left: false,
    };
    this.screen = screen;
    this.gameOver = false;
    this.alive = true;
    this.score = 0;
  }
  get newHead() {
    return { ...this.body[0] };
  }

  handleInput(newHead) {
    if (this.dir.up == true) {
      newHead.y -= this.speed;
    } else if (this.dir.down == true) {
      newHead.y += this.speed;
    } else if (this.dir.right == true) {
      newHead.x += this.speed;
    } else if (this.dir.left == true) {
      newHead.x -= this.speed;
    }
  }
  update(foods) {
    this.eatFood = false;
    let newHead = this.newHead;
    this.handleInput(newHead);
    for (let i = foods.foodList.length - 1; i >= 0; i--) {
      if (isColliding(newHead, this.size, foods.foodList[i], foods.size)) {
        this.eatFood = true;
        foods.foodList.splice(i, 1);
        foods.foodList.push(foods.generateFoodPos());
        this.score += 10;
        break;
      }
    }
    if (
      isCollidingWithWall(
        newHead,
        this.size,
        this.screen.width,
        this.screen.height,
      )
    ) {
      this.gameOver = true;
      this.alive = false;
    }
    if (isCollidingHead(newHead, this.body)) {
      this.gameOver = true;
      this.alive = false;
    }

    this.body.unshift(newHead);
    if (!this.eatFood) {
      this.body.pop();
    }
  }
}

module.exports = Player;
