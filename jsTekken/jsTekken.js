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

// -------------------------------------------------------------------------------

class Sprite {
  //  Just in case it does not capture canvas width or height, pass canvas in constructor as well
  constructor(position) {
    this.position = position;
  }

  draw(color) {
    console.log('Drawing Rectangle');
    context.fillStyle = color;
    context.fillRect(
      this.position.x,
      this.position.y,
      canvas.width * 0.2,
      canvas.height * 0.1
    );
  }
}

const player = new Sprite({
  x: 0,
  y: 135,
});
const enemy = new Sprite({
  x: 240,
  y: 135,
});

player.draw('red');
enemy.draw('blue');
