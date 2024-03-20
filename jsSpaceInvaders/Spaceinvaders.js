const grid = document.querySelector('.grid');
const resultDisplay = document.querySelector('.result');
const width = 15;
// Our hero shooter index
let currentShooterIndex = 217;
// A squares that contains all the created squares numbered 0-224
let squares = [];
// A invaders array that removes the eliminated enemies
let invadersRemoved = [];

// An alien Invaders array, which contains random numbers, but they get incremeneted
let invadersComing = [5, 6, 7, 8, 9, 10];

// So we are essentially looking for a 15x15 matrix or grid
for (let i = 0; i < width * width; i++) {
  // creating a new sqaure div everytime
  const square = document.createElement('div');
  // setting it's inner text to be no. of square
  // square.textContent = i;
  // appending it to the DOM
  grid.appendChild(square);
  // appending it to the grid_array
  squares.push(square);
}

// console.log(squares);

function draw() {
  for (let i = 0; i < invadersComing.length; i++) {
    // Check if the element does not exist/include in invadersRemoved array
    if (!invadersRemoved.includes(invadersComing[i])) {
      // Adding a class to sqaure elements matching the alienInvaders
      squares[invadersComing[i]].classList.add('invader');
    }
  }
}
draw();

/*The function below could be shortened */
let shooter = squares[currentShooterIndex];
shooter.classList.add('shooter');
function shooterWhere() {
  shooter.classList.remove('shooter');
  shooter = squares[currentShooterIndex];
  shooter.classList.add('shooter');
}

/* I need the move the shooter left,right,up and down based on the key pressed
   Here there were 2 ways, either adding keydown event to the document or the variable
*/

// Adding it first to the document
document.addEventListener('keydown', (event) => {
  // Handling 4 cases with switch-case, could be done with if-else as well
  console.log(event);
  switch (event.key) {
    case 'ArrowUp':
      moveShooterUp();
      break;
    case 'ArrowDown':
      moveShooterDown();
      break;
    case 'ArrowRight':
      moveShooterRight();
      break;
    case 'ArrowLeft':
      moveShooterLeft();
      break;
  }
});

/* One main question is how to add constraints so that shooter does not get out of the squares*/
function moveShooterUp() {
  //Now we need to move it actually
  // One way is when moves up, I deduct 15 indexes from the shooter variable
  if (currentShooterIndex >= width) {
    currentShooterIndex -= 15;
    shooterWhere();
    console.log('Shooter Moves Up');
  }
}
function moveShooterDown() {
  if (currentShooterIndex + width < squares.length) {
    currentShooterIndex += 15;
    shooterWhere();
    console.log('Shooter Moves Down');
  }
}
function moveShooterLeft() {
  // You can only get 0 at the left edge 0,15,30.....
  if (currentShooterIndex % width !== 0) {
    currentShooterIndex -= 1;
    shooterWhere();
    console.log('Shooter Moves Left');
  }
}
function moveShooterRight() {
  // You'll get multiple of width-1 as remainder
  if (currentShooterIndex % width !== width - 1) {
    currentShooterIndex += 1;
    shooterWhere();
    console.log('Shooter Moves Right');
  }
}

function removeInvaders() {
  for (let i = 0; i < invadersComing.length; i++) {
    squares[invadersComing[i]].classList.remove('invader');
  }
}

function moveInvadersDown() {
  for (let i = 0; i < invadersComing.length; i++) {
    removeInvaders();
    invadersComing[i] += 15;
    draw();
  }
}

function moveInvadersRight(n = 1) {
  for (let i = 0; i < invadersComing.length; i++) {
    removeInvaders();
    invadersComing[i] += n;
    draw();
  }
}

function moveInvadersLeft(n = 1) {
  for (let j = 0; j < invadersComing.length; j++) {
    removeInvaders();
    invadersComing[j] -= n;
    draw();
  }
}

let moveRight = true; // Flag to track movement direction

function moveEnemies() {
  // Determine if invaders hit left or right edge
  const leftEdge = invadersComing[0] % width === 0;

  const rightEdge =
    invadersComing[invadersComing.length - 1] % width === width - 1;

  if (leftEdge || rightEdge) {
    // Remove invaders and move them down
    removeInvaders();
    moveInvadersDown();

    // Reflect invaders if they hit the edges
    if (leftEdge) {
      moveRight = true; // Set movement direction to right
    } else {
      moveRight = false; // Set movement direction to left
    }
  }

  // Move invaders based on movement direction
  if (moveRight) {
    setTimeout(moveInvadersRight, 1000);
  } else {
    setTimeout(moveInvadersLeft, 1000);
  }
}

// setInterval(moveEnemies, 2000);
