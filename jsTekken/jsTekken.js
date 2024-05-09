const canvas = document.querySelector('canvas');
const phoneWarningMessage = document.getElementById('warning-message');
const context = canvas.getContext('2d');

// -----------------------------CANVAS DIMENSIONS-------------------------------------
// canvas.style.backgroundColor = 'black';
// canvas.style.width = '100vw';
// canvas.style.height = '100vh';

context.font = '20px Arial';
context.fillStyle = 'white';
context.fillText('Canvas Font!', 80, 50);

// ----------------------------------------------------------------------------------

// -----------------------------SCREEN ON LOAD FUNCTIONS ----------------------------
window.addEventListener('orientationchange', () => {
  const currentOrientation = window.orientation;
  const screenPortraitWidth = window.screen.width;
  if (
    currentOrientation === 0 ||
    currentOrientation === 180 ||
    screenPortraitWidth < 648
  ) {
    // Hide canvas
    canvas.style.display = 'none';
    phoneWarningMessage.style.display = 'block';
  } else {
    // Portrait mode (values might differ on some devices)
    // Show canvas
    canvas.style.display = 'block';
    phoneWarningMessage.style.display = 'none';
  }
});

window.onload = function () {
  // Simulate orientation change event on load
  window.dispatchEvent(new Event('orientationchange'));
  player.draw('red');
  enemy.draw('blue');
};

// ----------------------EVENT LISTERNERS ---------------------------------------
document.addEventListener('keydown', (e) => {
  //   console.log(e);
  switch (e.code) {
    case 'ArrowUp':
      console.log('Enemy was triggered to Jump');
      // enemy.moveUp('blue', 13.5);
      enemy.jump('blue');
      player.draw('red');
      break;
    case 'ArrowRight':
      if (enemy.position.x + canvas.width * 0.2 == canvas.width) {
        console.log("I won't move right anymore.");
        break;
      }
      console.log("I'll move right");
      enemy.undraw();
      enemy.update_X(10, 'blue');
      player.draw('red');
      break;
    case 'ArrowLeft':
      if (enemy.position.x == 0) {
        console.log("I won't move left anymore.");
        break;
      }
      console.log("I'll move left");
      enemy.undraw();
      enemy.update_X(-10, 'blue');
      player.draw('red');
    case 'ArrowDown':
    // enemy.moveDown('blue', 13.5);
    // player.draw('red');
    default:
      break;
  }
});

document.addEventListener('keydown', (e) => {
  //   console.log(e);
  switch (e.code) {
    case 'KeyW':
      console.log('Player was triggered to Jump');
      // player.moveUp('red', 13.5);
      // enemy.draw('blue');
      player.jump('red');
      enemy.draw('blue');
      break;
    case 'KeyD':
      if (player.position.x + canvas.width * 0.2 == canvas.width) {
        console.log("Player won't move right anymore.");
        break;
      }
      console.log('Player will move right');
      player.undraw();
      player.update_X(10, 'red');
      enemy.draw('blue');
      break;
    case 'KeyA':
      if (player.position.x == 0) {
        console.log("Player won't move left anymore.");
        break;
      }
      console.log('Player will move left');
      player.undraw();
      player.update_X(-10, 'red');
      enemy.draw('blue');
    case 'KeyS':
      // player.moveDown('red', 13.5);
      enemy.draw('blue');
    default:
      break;
  }
});

// -------------------------------------------------------------------------------

class Sprite {
  //  Just in case it does not capture canvas width or height, pass canvas in constructor as well
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.jumping = false;
    this.width = canvas.width * 0.2;
    this.height = canvas.height * 0.1;
  }

  draw(color) {
    // console.log('Drawing Rectangle');
    context.fillStyle = color;
    context.fillRect(
      this.position.x,
      this.position.y,
      canvas.width * 0.2,
      canvas.height * 0.1
    );
  }

  undraw() {
    context.clearRect(
      this.position.x,
      this.position.y,
      canvas.width * 0.2,
      canvas.height * 0.1
    );
  }

  update_X(value, color) {
    this.position.x += value;
    this.draw(color);
  }

  update_Y() {
    this.position.y -= value;
    this.draw(color);
  }

  jump(color) {
    if (!this.jumping) {
      // Check if the sprite is not already jumping
      this.jumping = true; // Set jumping flag to true
      let originalY = this.position.y;

      let jumpInterval = setInterval(() => {
        this.undraw(color);
        this.position.y = this.position.y - 10;
        this.draw(color);
        if (this.position.y <= originalY - 50) {
          console.log('I need to fall down now');
          clearInterval(jumpInterval);

          let fallInterval = setInterval(() => {
            this.undraw();
            this.position.y += 10;
            this.draw();
            if (this.position.y >= 135) {
              // Check if sprite has reached the ground
              clearInterval(fallInterval);
              this.jumping = false; // Reset jumping flag
            }
          }, 100);
        }
      }, 100);

      // As soon as it does that we start calling it back doing +points in position.Y and then stop if it reaches the end!

      // Do commment out moveUp() and moveDown() as they are not required!
      console.log('Jumping...');
    }
  }

  // moveUp(color, points) {
  //   if (this.position.y > 0) {
  //     // When called moveUp it reduces the Y coordinate
  //     this.undraw(color);
  //     // Updates and redraws the player rect
  //     this.position.y -= points;
  //     this.draw(color);
  //   }
  // }
  // moveDown(color, points) {
  //   if (this.position.y < 135) {
  //     // When called moveUp it reduces the Y coordinate
  //     this.undraw(color);
  //     // Updates and redraws the player rect
  //     this.position.y += points;
  //     this.draw(color);
  //   }
  // }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 135,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});
const enemy = new Sprite({
  position: {
    x: 240,
    y: 135,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});
