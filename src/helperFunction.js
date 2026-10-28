function isColliding(entityOne, entityOneSize, entityTwo, entityTwoSize) {
  return (
    entityOne.x < entityTwo.x + entityTwoSize &&
    entityOne.x + entityOneSize > entityTwo.x &&
    entityOne.y < entityTwo.y + entityTwoSize &&
    entityOne.y + entityOneSize > entityTwo.y
  );
}
function isCollidingWithWall(entity, entitySize, screenWidth, screenHeight) {
  return (
    entity.x + entitySize > screenWidth ||
    entity.x < 0 ||
    entity.y + entitySize > screenHeight ||
    entity.y < 0
  );
}
function isCollidingHead(head, entityList) {
  for (let component = 1; component < entityList.length; component++) {
    if (
      entityList[component].x === head.x &&
      entityList[component].y === head.y
    ) {
      return true;
    }
  }
  return false;
}

module.exports = { isColliding, isCollidingWithWall, isCollidingHead };
