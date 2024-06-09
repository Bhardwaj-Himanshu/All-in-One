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

let snake = new Snake([50], 'green');
let apple = new Apple(0, 'red');

snake.draw();
apple.draw();

document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'ArrowUp':
      snake.undraw();
      // Figure out the logic for collision up
      if (snake.positionArray[0] > 9) {
        snake.reducer(-10);
      }
      snake.draw();
      break;
    case 'ArrowDown':
      snake.undraw();
      // Figure out the logic for collision down
      // includes() can only check for one item
      if (snake.positionArray[0] < 90) {
        snake.reducer(10);
      }
      snake.draw();
      break;
    case 'ArrowLeft':
      snake.undraw();
      if (snake.positionArray[0] % 10 != 0) {
        snake.reducer(-1);
      }
      snake.draw();
      break;
    case 'ArrowRight':
      snake.undraw();
      if (snake.positionArray[0] % 10 != 9) {
        snake.reducer(1);
      }
      snake.draw();
      break;
    default:
      break;
  }
});
