let canvas = document.getElementById('canvas');
let scoreDisplay = document.getElementById('score-display');
let gridButtons = document.querySelectorAll('.grid-button');
// let ids = [];
let score = 0;

for (let i = 0; i < 100; i++) {
  let canvasCube = document.createElement('div');
  canvasCube.classList.add('canvas-cubes');
  // setAttribute() below automatically converts i as string even though it is an int.
  canvasCube.setAttribute('id', i);
  canvasCube.style.border = 'none';
  // ids.push(i);
  // canvasCube.textContent = i;
  canvas.appendChild(canvasCube);
}

let canvasCubes = document.querySelectorAll('.canvas-cubes');
// console.log(Array.from(canvasCubes));

/* Now I am thinking to add a sprite class, which has a draw(),undraw(),add() methods */
class Snake {
  constructor(positionArray, color) {
    this.positionArray = [...positionArray];
    this.color = color;
    this.currentInterval = null;
  }
  // <------------ HIGHLIGHT OF THE WHOLE CODE------------------------->
  // Index/ Array value reducers for array as well
  reducer(value) {
    // for (let i = 0; i < this.positionArray.length; i++) {
    //   this.positionArray[i] += value;
    // }
    if (this.positionArray.length > 1) {
      this.positionArray.pop(); // Remove the tail
      // console.log(`After pop ${this.positionArray}`);
      this.positionArray.unshift(this.positionArray[0] + value);
      // console.log(`After unshift ${this.positionArray}`);
    } else {
      this.positionArray[0] += value;
    }
  }

  // draws the snake on the respective cubes
  draw() {
    // for (let i = 0; i < this.positionArray.length; i++) {
    //   let element = this.positionArray[i];
    //   setTimeout(() => {
    //     canvasCubes[element].style.backgroundColor = 'green';
    //   }, 300);
    // }
    let head = this.positionArray[0];
    canvasCubes[head].style.backgroundColor = this.color;
  }

  // undraws the snakes from the previous div's so it looks like it is moving
  undraw() {
    // for (let i = 0; i < this.positionArray.length; i++) {
    //   let element = this.positionArray[i];
    //   setTimeout(() => {
    //     canvasCubes[element].style.backgroundColor = '';
    //   }, 300);
    // }
    let tail = this.positionArray[this.positionArray.length - 1];
    canvasCubes[tail].style.backgroundColor = '';
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
    // this.currentInterval = setInterval(() => {
    //   this.undraw();
    //   this.reducer(increment);
    //   this.draw();

    //   if (this.gameOver(increment)) {
    //     clearInterval(this.currentInterval);
    //     console.log(`Game Over due to ${increment}`);
    //     this.undraw();
    //   }
    // }, 1000);
    this.currentInterval = setInterval(() => {
      if (this.gameOver(increment)) {
        clearInterval(this.currentInterval);
        // console.log(`Game Over due to ${increment}`);
        return;
      }
      this.undraw(); // undrawing on the tail and not the complete array
      this.reducer(increment);
      this.draw(); // drawing only the head and not the complete array
    }, 300);
  }

  pause() {
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
    }
  }

  // game-Over function() which checks if game is over due to collision, currently only with walls
  gameOver(increment) {
    // if (increment == -1) {
    //   let head = this.positionArray[this.positionArray.length - 1];
    //   if (increment == -1 && head % 10 == 9) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // } else {
    //   let head = this.positionArray[0];
    //   if (
    //     head < 0 ||
    //     head > 99 ||
    //     (increment == -1 && head % 10 == 9) ||
    //     (increment == 1 && head % 10 == 0)
    //   ) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
    let head = this.positionArray[0] + increment;
    return (
      (() => {
        if (head > 0 && head < 100) {
          return canvasCubes[head].style.backgroundColor == 'green';
        }
        return false;
      })() ||
      head < 0 ||
      head >= 100 ||
      (increment === -1 && head % 10 === 9) ||
      (increment === 1 && head % 10 === 0)
    );
  }
}

class Apple {
  constructor(position, color) {
    this.position = position;
    this.color = color;
  }

  // A method that generates new random position and updates the this.position
  newPosition(snake) {
    this.position = Math.floor(Math.random() * 100);
    if (!snake.positionArray.includes(this.position)) {
      return this.position;
    }
    // this.position = Math.floor(Math.random() * 100);
    this.newPosition(snake);
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
canvasCubes[-1] = document.createElement('div');
async function appleDrawer_gameIncrementor(a, s) {
  if (a.position == s.positionArray[0]) {
    console.log(s.positionArray);
    a.undraw();
    s.add(s.positionArray[s.positionArray.length - 1]);
    // s.add(0);
    // s.add(-1);
    console.log(s.positionArray);
    s.draw();
    // console.log(canvasCubes[a.position].id);
    // canvasCubes[a.position].style.backgroundColor = 'green';
    console.log(s.positionArray);
    await a.newPosition(snake);
    a.draw();
    score++;
    scoreDisplay.textContent = score;
    return true;
  }
  return false;
}

document.addEventListener('keydown', (e) => {
  // console.log(e);
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
      if (snake.positionArray[snake.positionArray.length - 1] % 10 !== 0) {
        snake.move(-1);
      }
      break;
    case 'ArrowRight':
      if (snake.positionArray[0] % 10 !== 9) {
        snake.move(1);
      }
      break;
    case 'NumpadEnter':
      snake.pause();
      break;
    case 'default':
      break;
  }
});

gridButtons.forEach((gridButton) => {
  gridButton.addEventListener('click', (e) => {
    // console.log(e.target.id);
    switch (e.target.id) {
      case 'show-grid':
        canvas.innerHTML = '';
        for (let i = 0; i < 100; i++) {
          let canvasCube = document.createElement('div');
          canvasCube.classList.add('canvas-cubes');
          // setAttribute() below automatically converts i as string even though it is an int.
          canvasCube.setAttribute('id', i);
          // ids.push(i);
          canvasCube.textContent = i;
          canvas.appendChild(canvasCube);
        }
        canvasCubes = document.querySelectorAll('.canvas-cubes');

        let snake1 = new Snake([54], 'green');
        let apple1 = new Apple(14, 'red');
        snake1.draw();
        apple1.draw();
        break;
      case 'dont-show-grid':
        canvas.innerHTML = '';
        for (let i = 0; i < 100; i++) {
          let canvasCube = document.createElement('div');
          canvasCube.classList.add('canvas-cubes');
          canvasCube.style.border = 'none';
          // setAttribute() below automatically converts i as string even though it is an int.
          canvasCube.setAttribute('id', i);
          // ids.push(i);
          // canvasCube.textContent = i;
          canvas.appendChild(canvasCube);
        }

        canvasCubes = document.querySelectorAll('.canvas-cubes');

        let snake2 = new Snake([54], 'green');
        let apple2 = new Apple(14, 'red');
        snake2.draw();
        apple2.draw();
        break;
      default:
        break;
    }
  });
});

let snake = new Snake([54], 'green');
let apple = new Apple(14, 'red');

snake.draw();
// snake.move(1);
apple.draw();

setInterval(() => {
  let result = appleDrawer_gameIncrementor(apple, snake);
  if (result) {
    // console.log('Apple should be redrawn.');
  }
}, 50);
