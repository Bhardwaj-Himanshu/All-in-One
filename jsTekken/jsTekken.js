const canvas = document.querySelector('canvas');
const phoneWarningMessage = document.getElementById('warning-message');
console.log(phoneWarningMessage);
const context = canvas.getContext('2d');

canvas.style.backgroundColor = 'black';
canvas.style.width = '100vw';
canvas.style.height = '100vh';

window.addEventListener('orientationchange', () => {
  const currentOrientation = window.orientation;
  const screenPortraitWidth = window.screen.width;
  console.log(screenPortraitWidth);
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

console.log('Hello from js world');
