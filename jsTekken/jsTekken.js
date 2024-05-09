const canvas = document.querySelector('canvas');
const phoneWarningMessage = document.getElementById('warning-message');
const context = canvas.getContext('2d');

// -----------------------------CANVAS DIMENSIONS-------------------------------------
// canvas.style.backgroundColor = 'black';
// canvas.style.width = '100vw';
// canvas.style.height = '100vh';
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
      enemy.moveUp('blue', 13.5);
      player.draw('red');
      break;
    case 'ArrowRight':
      if (enemy.position.x + canvas.width * 0.2 == canvas.width) {
        console.log("I won't move right anymore.");
        break;
      }
      console.log("I'll move right");
      enemy.undraw(false, true);
      enemy.update_X(10, 'blue');
      player.draw('red');
      break;
    case 'ArrowLeft':
      if (enemy.position.x == 0) {
        console.log("I won't move left anymore.");
        break;
      }
      console.log("I'll move left");
      enemy.undraw(false, true);
      enemy.update_X(-10, 'blue');
      player.draw('red');
    case 'ArrowDown':
      enemy.moveDown('blue', 13.5);
      player.draw('red');
    default:
      break;
  }
});

document.addEventListener('keydown', (e) => {
  //   console.log(e);
  switch (e.code) {
    case 'KeyW':
      console.log('Player was triggered to Jump');
      player.moveUp('red', 13.5);
      enemy.draw('blue');
      break;
    case 'KeyD':
      if (player.position.x + canvas.width * 0.2 == canvas.width) {
        console.log("Player won't move right anymore.");
        break;
      }
      console.log('Player will move right');
      player.undraw(true, false);
      player.update_X(10, 'red');
      enemy.draw('blue');
      break;
    case 'KeyA':
      if (player.position.x == 0) {
        console.log("Player won't move left anymore.");
        break;
      }
      console.log('Player will move left');
      player.undraw(true, false);
      player.update_X(-10, 'red');
      enemy.draw('blue');
    case 'KeyS':
      player.moveDown('red', 13.5);
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
    this.height = canvas.height * 0.1;
    this.width = canvas.width * 0.2;
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

  undraw(shouldClearPlayer = true, shouldClearEnemy = true) {
    if (shouldClearPlayer) {
      context.clearRect(
        player.position.x,
        player.position.y,
        canvas.width * 0.2,
        canvas.height * 0.1
      );
    }
    if (shouldClearEnemy) {
      context.clearRect(
        enemy.position.x,
        enemy.position.y,
        canvas.width * 0.2,
        canvas.height * 0.1
      );
    }
  }

  update_X(value, color) {
    this.position.x += value;
    this.draw(color);
  }

  update_Y() {
    this.position.y -= value;
    this.draw(color);
  }

  jump() {
    // We'll animate or setInterval until it reaches a specific height let's say this.position.Y-100 or crosses it!
    // As soon as it does that we start calling it back doing +points in position.Y and then stop if it reaches the end!
    // Do commment out moveUp() and moveDown() as they are not required!
    console.log('I am empty and you called me!');
  }

  moveUp(color, points) {
    if (this.position.y > 0) {
      // When called moveUp it reduces the Y coordinate
      this.undraw(color);
      // Updates and redraws the player rect
      this.position.y -= points;
      this.draw(color);
    }
  }
  moveDown(color, points) {
    if (this.position.y < 135) {
      // When called moveUp it reduces the Y coordinate
      this.undraw(color);
      // Updates and redraws the player rect
      this.position.y += points;
      this.draw(color);
    }
  }
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
