const grid = document.querySelector('.grid');
const resultDisplay = document.querySelector('.result');
const levelDiv = document.querySelector('.level');
const levelButtons = document.querySelectorAll('.level button');
const easyButton = document.getElementById('Easy');
const mediumButton = document.getElementById('Medium');
const hardButton = document.getElementById('Hard');
const controlButtons = document.querySelectorAll('.controls button');

// Setting the default level of the game
easyButton.classList.add('active');

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

function drawEnemies() {
  for (let i = 0; i < invadersComing.length; i++) {
    // Check if the element does not exist/include in invadersRemoved array
    if (easyButton.classList.contains('active')) {
      if (!invadersRemoved.includes(i)) {
        // Adding a class to sqaure elements matching the alienInvaders
        squares[invadersComing[i]].classList.add('invader');
      }
    } else {
      if (!invadersRemoved.includes(invadersComing[i])) {
        // Adding a class to sqaure elements matching the alienInvaders
        squares[invadersComing[i]].classList.add('invader');
      }
    }
  }
}
drawEnemies();

function removeInvaders() {
  for (let i = 0; i < invadersComing.length; i++) {
    squares[invadersComing[i]].classList.remove('invader');
  }
}

/*The function below could be shortened */
let shooter = squares[currentShooterIndex];
shooter.classList.add('shooter');
function drawShooter() {
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
  // console.log(event);
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
    case 'x':
      shoot();
      break;
  }
});

/* Adding another event listener for the level selection */
levelDiv.addEventListener('click', (e) => {
  switch (e.target.textContent) {
    case 'Easy':
      levelButtons.forEach((button) => button.classList.remove('active'));
      removeInvaders();
      easyButton.classList.add('active');
      invadersComing = [5, 6, 7, 8, 9, 10];
      invadersRemoved = [];
      drawEnemies();
      break;
    case 'Medium':
      levelButtons.forEach((button) => button.classList.remove('active'));
      removeInvaders();
      mediumButton.classList.add('active');
      invadersComing = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 30, 45, 60, 75,
        29, 44, 59, 74, 89, 90, 104, 105, 119, 120, 134, 135, 149, 150, 151,
        152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164,
      ];
      invadersRemoved = [];
      drawEnemies();
      break;
    case 'Hard':
      levelButtons.forEach((button) => button.classList.remove('active'));
      removeInvaders();
      hardButton.classList.add('active');
      invadersComing = [5, 6, 7, 8, 9, 10];
      invadersRemoved = [];
      drawEnemies();
      break;
  }
});

let movingEnemies;
/* This is how you addEventListener for multiple items at once*/
controlButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    switch (e.target.textContent) {
      case 'Start':
        movingEnemies = setInterval(moveEnemies, 500);
        break;
      case 'Stop':
        clearInterval(movingEnemies);
        break;
      case 'Reset':
        clearInterval(movingEnemies);
        removeInvaders();
        currentShooterIndex = 217;
        drawShooter();
        invadersComing = [5, 6, 7, 8, 9, 10];
        invadersRemoved = [];
        drawEnemies();
        resultDisplay.textContent = 0;
        levelButtons.forEach((e) => e.classList.remove('active'));
        easyButton.classList.add('active');
        break;
      default:
        break;
    }
  });
});

/* One main question is how to add constraints so that shooter does not get out of the squares*/
function moveShooterUp() {
  //Now we need to move it actually
  // One way is when moves up, I deduct 15 indexes from the shooter variable
  if (currentShooterIndex >= width) {
    currentShooterIndex -= 15;
    drawShooter();
    // console.log(currentShooterIndex);
    // console.log('Shooter Moves Up');
  }
}
function moveShooterDown() {
  if (currentShooterIndex + width < squares.length) {
    currentShooterIndex += 15;
    drawShooter();
    // console.log(currentShooterIndex);
    // console.log('Shooter Moves Down');
  }
}
function moveShooterLeft() {
  // You can only get 0 at the left edge 0,15,30.....
  if (currentShooterIndex % width !== 0) {
    currentShooterIndex -= 1;
    drawShooter();
    // console.log(currentShooterIndex);
    // console.log('Shooter Moves Left');
  }
}
function moveShooterRight() {
  // You'll get multiple of width-1 as remainder
  if (currentShooterIndex % width !== width - 1) {
    currentShooterIndex += 1;
    drawShooter();
    // console.log(currentShooterIndex);
    // console.log('Shooter Moves Right');
  }
}

function moveInvadersDown() {
  for (let i = 0; i < invadersComing.length; i++) {
    removeInvaders();
    invadersComing[i] += 15;
    // invadersRemoved[i] += 15;
    drawEnemies();
  }
}

function moveInvadersRight(n = 1) {
  for (let i = 0; i < invadersComing.length; i++) {
    removeInvaders();
    invadersComing[i] += n;
    // invadersRemoved[i] += n;
    drawEnemies();
  }
}

function moveInvadersLeft(n = 1) {
  for (let j = 0; j < invadersComing.length; j++) {
    removeInvaders();
    invadersComing[j] -= n;
    // invadersRemoved[j] -= n;
    drawEnemies();
  }
}

let moveRight = true; // Flag to track movement direction
function moveEnemies() {
  // CHECK IF GAME IS OVER DUE TO WINNING?
  // if (invadersComing.length == 0) {
  //   clearInterval(movingEnemies); // Stop the movement of invaders
  //   resultDisplay.textContent = 'YOU WIN!'; // Display winning message
  //   return; // Exit the function
  // }

  // CHECK IF GAME IS OVER DUE TO LOSING?
  if (invadersComing.includes(currentShooterIndex)) {
    clearInterval(movingEnemies);
    resultDisplay.textContent = 'GAME OVER';
    removeInvaders();
    invadersComing = [5, 6, 7, 8, 9, 10];
    drawEnemies();
    currentShooterIndex = 217;
    drawShooter();
    return;
  }

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
    setTimeout(moveInvadersRight, 200);
  } else {
    setTimeout(moveInvadersLeft, 200);
  }
}

function shoot() {
  let laserIndex = currentShooterIndex;

  let laserInterval = setInterval(() => {
    if (laserIndex < 0) {
      clearInterval(laserInterval);
      laserIndex = currentShooterIndex;
      return;
    }
    squares[laserIndex].classList.remove('laser');
    laserIndex -= 15;
    if (laserIndex >= 0) {
      if (squares[laserIndex].classList.contains('invader')) {
        squares[laserIndex].classList.remove('laser');
        squares[laserIndex].classList.remove('invader');
        squares[laserIndex].classList.add('boom');

        setTimeout(() => {
          squares[laserIndex].classList.remove('boom');
          resultDisplay.textContent = Number(resultDisplay.textContent) + 1;
          const aliensRemoved = invadersComing.indexOf(laserIndex);
          // invadersComing.splice(laserIndex, 1);
          console.log(invadersComing);
          invadersRemoved.push(aliensRemoved);
          // console.log(invadersRemoved);
        }, 50);
      }
      squares[laserIndex].classList.add('laser');
    }
  }, 100);
}
