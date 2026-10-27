function isColliding(entityOne, entityOneSize, entityTwo, entityTwoSize) {
  return (
    entityOne.x < entityTwo.x + entityTwoSize &&
    entityOne.x + entityOneSize > entityTwo.x &&
    entityOne.y < entityTwo.y + entityTwoSize &&
    entityOne.y + entityOneSize > entityTwo.y
  );
}

module.exports = { isColliding };
