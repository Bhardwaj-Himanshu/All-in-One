const grid = document.querySelector('.grid');
const resultDisplay = document.querySelector('.result');
const width = 15;
// A grid_array that contains all the created squares numbered 0-224
let grid_array = [];

// An alien Invaders array, which contains random numbers, but they get incremeneted
const alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 28, 29, 30, 31,
  32, 33, 34, 35,
];

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
  for (let i = 0; i < alienInvaders.length; i++) {
    // We get the element number we need to change
    const alienIndex = alienInvaders[i];
    // Then we get the <div> cell from grid_array using element as element index for grid_array
    const gridCell = grid_array[alienIndex];
    // change the style to red
    gridCell.style.backgroundColor = 'red';
    // increment the alienInvaders
    alienInvaders[i]++;
  }
  console.log(alienInvaders);
}, 3000);
