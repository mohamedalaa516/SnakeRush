class Food {
  constructor(size, screen) {
    this.size = size;
    this.screen = screen;
    this.foodList = [];
    this.capacity = 150;
  }

  generateFoodPos() {
    return {
      x: Math.floor(Math.random() * (this.screen.width / 20)) * 20,
      y: Math.floor(Math.random() * (this.screen.height / 20)) * 20,
      size: 10,
    };
  }
  createFoods() {
    for (let i = 0; i < this.capacity; i++) {
      this.foodList.push(this.generateFoodPos());
    }
  }
}

module.exports = Food;
