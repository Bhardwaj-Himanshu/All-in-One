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
};

// ----------------------EVENT LISTERNERS ---------------------------------------
document.addEventListener('keydown', (e) => {
  //   console.log(e);
  switch (e.code) {
    case 'ArrowRight':
      if (enemy.position.x + canvas.width * 0.2 == canvas.width) {
        console.log("I won't move right anymore.");
        break;
      }
      console.log("I'll move right");
      enemy.undraw(false, true);
      enemy.update(10, 'blue');
      player.draw('red');
      break;
    case 'ArrowLeft':
      if (enemy.position.x == 0) {
        console.log("I won't move left anymore.");
        break;
      }
      console.log("I'll move left");
      enemy.undraw(false, true);
      enemy.update(-10, 'blue');
      player.draw('red');
    default:
      break;
  }
});

document.addEventListener('keydown', (e) => {
  //   console.log(e);
  switch (e.code) {
    case 'KeyD':
      if (player.position.x + canvas.width * 0.2 == canvas.width) {
        console.log("Player won't move right anymore.");
        break;
      }
      console.log('Player will move right');
      player.undraw(true, false);
      player.update(10, 'red');
      enemy.draw('blue');
      break;
    case 'KeyA':
      if (player.position.x == 0) {
        console.log("Player won't move left anymore.");
        break;
      }
      console.log('Player will move left');
      player.undraw(true, false);
      player.update(-10, 'red');
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

  update(value, color) {
    this.position.x += value;
    this.draw(color);
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

player.draw('red');
enemy.draw('blue');
