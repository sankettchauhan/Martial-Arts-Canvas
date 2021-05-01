let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");

const animations = ["idle", "punch", "kick", "backward", "forward", "block"];
const mapKeyToAnimation = {
  z: "punch",
  x: "kick",
  arrowleft: "backward",
  arrowright: "forward",
  arrowdown: "block",
};

let loadImage = (src, callback) => {
  let img = document.createElement("img");
  img.onload = () => callback(img);
  img.src = src;
};

let imagePath = (frameNumber, animation) =>
  `images/${animation}/${frameNumber}.png`;

let frames = {
  idle: [1, 2, 3, 4, 5, 6, 7, 8],
  punch: [1, 2, 3, 4, 5, 6, 7],
  kick: [1, 2, 3, 4, 5, 6, 7],
  backward: [1, 2, 3, 4, 5, 6],
  forward: [1, 2, 3, 4, 5, 6],
  block: [1, 2, 3, 4, 5, 6, 7, 8, 9],
};

let loadImages = (callback) => {
  let images = {
    punch: [],
    idle: [],
    kick: [],
    backward: [],
    forward: [],
    block: [],
  };
  let imagesToLoad = 0;

  animations.forEach((animation) => {
    imagesToLoad = imagesToLoad + frames[animation].length;

    frames[animation].forEach((frameNumber) => {
      let path = imagePath(frameNumber, animation);
      loadImage(path, (image) => {
        images[animation][frameNumber - 1] = image;
        imagesToLoad -= 1;

        if (imagesToLoad === 0) {
          callback(images);
        }
      });
    });
  });
};

let animate = (ctx, images, animation, callback) => {
  images[animation].forEach((image, index) => {
    setTimeout(() => {
      ctx.clearRect(0, 0, 500, 500);
      ctx.drawImage(image, 0, 0, 500, 500);
    }, index * 100);
  });

  setTimeout(callback, images[animation].length * 100);
};

loadImages((images) => {
  let queuedAnimation = [];

  let aux = () => {
    let selectedAnimation;
    if (queuedAnimation.length === 0) selectedAnimation = "idle";
    else selectedAnimation = queuedAnimation.shift();
    animate(ctx, images, selectedAnimation, aux);
  };

  aux();

  let buttonsArray = document.getElementsByTagName("button");
  buttonsArray = Array.from(buttonsArray);
  console.log(buttonsArray);
  buttonsArray.forEach((button, index) => {
    button.onclick = () => {
      queuedAnimation.push(animations[index + 1]);
    };
  });

  document.addEventListener("keydown", (e) => {
    for (const key in mapKeyToAnimation) {
      if (e.key.toLowerCase() === key)
        queuedAnimation.push(mapKeyToAnimation[key]);
    }
  });
});
