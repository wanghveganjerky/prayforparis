const bombArtArray = [
  "|\\**/|",
  "\\ == /",
  " |**|",
  " |**|",
  " \\  /",
  "  \\/"
];

const explosiveArtArray = [
  "          __ ..__  __, __ ..          ",
  "          __ ..__  __, __ ..          ",
  "        (__ ' ' ( `  )__  .__)        ",
  "        (__ ' ' ( `  )__  .__)        ",
  "      ( (  (    )      `)  ) _  )      ",
  "      ( (  (    )      `)  ) _  )      ",
  "     (__(__ (_   (_ . _) _)__) ,__)    ",
  "     (__(__ (_   (_ . _) _)__) ,__)    ",
  "         ``~~~`\\ '   ' /~~~``        ",
  "         ``~~~`\\ '   ' /~~~``        ",
  "                ;;   ;;               ",
  "                ;;   ;;               ",
  "                //   \\\\               ",
  "                //   \\\\               ",
  "               //__ __\\\\              ",
  "               //__ __\\\\              "
];

const bombArt = bombArtArray.join('\n');
const explosiveArt = explosiveArtArray.join('\n');

const bombElement = document.getElementById('bomb');
bombElement.textContent = bombArt;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const bombFrames = [bombElement.textContent.trim()];
const explosiveFrames = [explosiveArt.trim()];

const NUM_BOMBS = 15;
const BOMB_SPEED = 15;
const FONT_SIZE = 10;
const LINE_HEIGHT = FONT_SIZE * 1.5;

class Bomb {
  constructor(index) {
    this.index = index;
    this.speed = BOMB_SPEED + (Math.random() * 16 - 8);
    this.reset(true);
  }

  reset(firstTime = false) {
    this.x = Math.random() * canvas.width;
    
    if (firstTime) {
        this.y = -(Math.random() * canvas.height * 2);
    } else {
        this.y = -Math.random() * canvas.height;
    }
    this.isExploding = false;
  }

  explode() {
    this.isExploding = true;
    this.explosionX = this.x;
    this.explosionY = this.y;
    this.explosionTime = Date.now();
    ctx.font = `${FONT_SIZE}px monospace`;
    ctx.fillStyle = '#EE4B2B';
    const lines = explosiveFrames[0].split('\n');
    let y = canvas.height - (lines.length * LINE_HEIGHT);
    lines.forEach(line => {
      ctx.fillText(line, this.x, y);
      y += LINE_HEIGHT;
    });

    setTimeout(() => {
      this.reset();
    }, 5000); // Explosion lasts for 1 second
  }

  draw() {
    if(this.isExploding) return;
    const lines = bombFrames[0].split('\n');
    let y = this.y;
    ctx.font = `${FONT_SIZE}px monospace`;

    lines.forEach((line, index) => {
      if (index % 2 === 0) {
        ctx.fillStyle = '#00008C';
      } else {
        
        ctx.fillStyle = '#EE4B2B';
      }
      ctx.fillText(line, this.x, y);
      y += LINE_HEIGHT;
    });

    this.y += this.speed;
    if (this.y - lines.length * LINE_HEIGHT > canvas.height) {
      this.explode();
    }
  }
}

const bombs = Array.from({ length: NUM_BOMBS }, (_, index) => new Bomb(index));


let windDirection = Math.random() * Math.PI * 2;  // Random initial wind direction
let windSpeed = 1;  // Set your desired wind speed

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.vx = Math.random() * 0.5 - 0.25;
        this.vy = Math.random() * 0.5 - 0.25;
    }

    checkForExplosions(bombs) {
      bombs.forEach(bomb => {
        if (bomb.isExploding) {
          const dx = this.x - bomb.explosionX;
          const dy = this.y - bomb.explosionY;
          const distance = Math.sqrt(dx*dx + dy*dy);
          if (distance < 110) {  // Change 100 
            const angle = Math.atan2(dy, dx);
            this.vx += Math.cos(angle + Math.PI) * 2;  // Change 1 
            this.vy += Math.sin(angle + Math.PI) * 2;  // Change 1 
          }
        }
      });
    }
  

    draw() {
        ctx.fillStyle = `rgba(150, 150, 150, 0.15)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        // Particle velocity plus wind velocity
        this.x += this.vx + windSpeed * Math.cos(windDirection);
        this.y += this.vy + windSpeed * Math.sin(windDirection);

        // Wrap particles around to the other side of the canvas
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }
}

// Create an array of particles
const particles = Array.from({ length: 600 }, () => new Particle());

function drawParticles() {
  particles.forEach(particle => {
    particle.checkForExplosions(bombs);
    particle.update();
    particle.draw();
  });
}



function drawBombs() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawParticles();
  bombs.forEach(bomb => {
    if (!bomb.isExploding) {
      bomb.draw();
    }
  });
}

setInterval(drawBombs, 100);
