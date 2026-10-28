export const foodImage = new Image();
foodImage.src = "assets/apple.png";

export const snakeImages = {};
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
  snakeImages[key] = image;
}
