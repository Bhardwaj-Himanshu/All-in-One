let canvas = document.getElementById('canvas');
let ids = [];

for (let i = 0; i < 100; i++) {
  let canvasCube = document.createElement('div');
  canvasCube.classList.add('canvas-cubes');
  // setAttribute() below automatically converts i as string even though it is an int.
  canvasCube.setAttribute('id', i);
  ids.push(i);
  canvasCube.textContent = i;
  canvas.appendChild(canvasCube);
}

let canvasCubes = document.querySelectorAll('.canvas-cubes');
// console.log(canvasCubes);

/* Now I am thinking to add a sprite class, which has a draw(),undraw(),add() methods */
class Snake {
  constructor(positionArray, color) {
    this.positionArray = [...positionArray];
    this.color = color;
    this.currentInterval = null;
  }

  // Index/ Array value reducers for array as well
  reducer(value) {
    for (let i = 0; i < this.positionArray.length; i++) {
      this.positionArray[i] += value;
    }
  }

  // draws the snake on the respective cubes
  draw() {
    for (let i = 0; i < canvasCubes.length; i++) {
      if (this.positionArray.includes(Number(canvasCubes[i].id))) {
        canvasCubes[i].style.backgroundColor = `${this.color}`;
      }
    }
  }

  // undraws the snakes from the previous div's so it looks like it is moving
  undraw() {
    for (let i = 0; i < canvasCubes.length; i++) {
      if (this.positionArray.includes(Number(canvasCubes[i].id))) {
        canvasCubes[i].style.backgroundColor = ``;
      }
    }
  }

  // a add method --> when snake eats apple we add the index of that cube to the array snake
  add(index) {
    this.positionArray.push(index);
  }

  // a move() function using which snake moves in the other direction
  move(increment) {
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
    }
    this.currentInterval = setInterval(() => {
      this.undraw();
      this.reducer(increment);
      this.draw();

      if (this.gameOver(increment)) {
        clearInterval(this.currentInterval);
        console.log(`Game Over due to ${increment}`);
      }
    }, 1000);
  }

  // game-Over function() which checks if game is over due to collision, currently only with walls
  gameOver(increment) {
    let head = this.positionArray[0];
    if (
      head <= 9 ||
      head >= 90 ||
      (increment == -1 && head % 10 == 0) ||
      (increment == 1 && head % 10 == 9)
    ) {
      return true;
    } else {
      return false;
    }
  }
}

class Apple {
  constructor(position, color) {
    this.position = position;
    this.color = color;
  }

  // A method that generates new random position and updates the this.position
  newPosition() {
    this.position = Math.floor(Math.random() * 100);
    return this.position;
  }

  // Apple will have a draw() method similar to snake
  draw() {
    for (let i = 0; i < canvasCubes.length; i++) {
      if (Number(canvasCubes[i].id) == this.position) {
        canvasCubes[i].style.backgroundColor = `${this.color}`;
      }
    }
  }
  // Similarly a undraw() method
  undraw() {
    for (let i = 0; i < canvasCubes.length; i++) {
      if (Number(canvasCubes[i].id) == this.position) {
        canvasCubes[i].style.backgroundColor = ``;
      }
    }
  }
}

document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'ArrowUp':
      if (snake.positionArray[0] > 9) {
        snake.move(-10);
      }
      break;
    case 'ArrowDown':
      if (snake.positionArray[0] < 90) {
        snake.move(10);
      }
      break;
    case 'ArrowLeft':
      if (snake.positionArray[0] % 10 !== 0) {
        snake.move(-1);
      }
      break;
    case 'ArrowRight':
      if (snake.positionArray[0] % 10 !== 9) {
        snake.move(1);
      }
      break;
    default:
      break;
  }
});

let snake = new Snake([50], 'green');
let apple = new Apple(0, 'red');

snake.draw();
// snake.move(1);
apple.draw();
