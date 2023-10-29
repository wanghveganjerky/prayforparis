const bombArtArray = [
  "|\\**/|",
  "\\ == /",
  " |  |",
  " |  |",
  " \\  /",
  "  \\/"
];

const explosiveArtArray = [
  "      _ ._  _ , _ ._      ",
  "    (_ ' ( `  )_  .__)    ",
  "  ( (  (    )   `)  ) _)  ",
  " (__ (_   (_ . _) _) ,__) ",
  "     `~~`\\ ' . /`~~`     ",
  "          ;   ;           ",
  "          /   \\           ",
  "         /_ __ \\"
];

const bombArt = bombArtArray.join('\n');
const explosiveArt = explosiveArtArray.join('\n');

const bombElement = document.getElementById('bomb');
bombElement.textContent = bombArt;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const bombFrames = [bombElement.textContent.trim()];
const explosiveFrames = [explosiveArt.trim()];

const NUM_BOMBS = 15;
const BOMB_SPEED = 15;
const FONT_SIZE = 15;
const LINE_HEIGHT = FONT_SIZE * 1.5;

class Bomb {
  constructor(index) {
    this.index = index;
    this.reset(true);
  }

  reset(firstTime = false) {
    this.x = Math.random() * canvas.width;
    
    if (firstTime) {
        this.y = -(Math.random() * canvas.height * 2);
    } else {
        this.y = -Math.random() * canvas.height;
    }
  }

  explode() {
    ctx.font = `${FONT_SIZE}px monospace`;
    ctx.fillStyle = 'red';
    const lines = explosiveFrames[0].split('\n');
    let y = canvas.height - (lines.length * LINE_HEIGHT);
    lines.forEach(line => {
      ctx.fillText(line, this.x, y);
      y += LINE_HEIGHT;
    });

    setTimeout(() => {
      this.reset();
    }, 1000); // Explosion lasts for 1 second
  }

  draw() {
    const lines = bombFrames[0].split('\n');
    let y = this.y;
    ctx.font = `${FONT_SIZE}px monospace`;
    ctx.fillStyle = 'black';
    lines.forEach(line => {
      ctx.fillText(line, this.x, y);
      y += LINE_HEIGHT;
    });

    this.y += BOMB_SPEED;
    if (this.y - lines.length * LINE_HEIGHT > canvas.height) {
      this.explode();
    }
  }
}

const bombs = Array.from({ length: NUM_BOMBS }, (_, index) => new Bomb(index));

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawBombs() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bombs.forEach(bomb => bomb.draw());
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
setInterval(drawBombs, 100);