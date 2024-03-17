const grid = document.querySelector('.grid');
const resultDisplay = document.querySelector('.result');
const width = 15;
// A grid_array that contains all the created squares numbered 0-224
let grid_array = [];

// An alien Invaders array, which contains random numbers, but they get incremeneted
const alienInvaders = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

// So we are essentially looking for a 15x15 matrix or grid
for (let i = 0; i < width * width; i++) {
  // creating a new sqaure div everytime
  const square = document.createElement('div');
  // setting it's inner text to be no. of square
  square.textContent = i;
  // appending it to the DOM
  grid.appendChild(square);
  // appending it to the grid_array
  grid_array.push(square);
}

setInterval(() => {
  // Reset every child element inside grid_array to have a color white
  for (let j = 0; j < grid_array.length; j++) {
    grid_array[j].style.backgroundColor = 'white';
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    // Need to check this if condition here
    if (
      alienInvaders[alienInvaders.length - 1] <
      Number(grid_array[grid_array.length - 1].textContent)
    ) {
      grid_array[alienInvaders[i]].style.backgroundColor = 'red';
      alienInvaders[i] += 15;
    }
  }
  console.log(alienInvaders);
}, 3000);
