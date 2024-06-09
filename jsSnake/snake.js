let canvas = document.getElementById('canvas');

for (let i = 0; i < 100; i++) {
  let canvasCube = document.createElement('div');
  canvasCube.classList.add('canvas-cubes');
  canvasCube.setAttribute('id', i);
  canvasCube.textContent = i;
  canvas.appendChild(canvasCube);
}

/* Now I am thinking to add a sprite class, which has a draw(),undraw(),add() methods */
