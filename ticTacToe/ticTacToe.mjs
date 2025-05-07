import binary from './ticTacToeEngine.mjs'

const board = document.getElementById('game-board');
let currentPlayer = 'X';

function gameOver() {
    const cells = board.children;
    const wins = [
      [0, 1, 2], // top row
      [3, 4, 5], // middle row
      [6, 7, 8], // bottom row
      [0, 3, 6], // left column
      [1, 4, 7], // middle column
      [2, 5, 8], // right column
      [0, 4, 8], // main diagonal
      [2, 4, 6]  // anti-diagonal
    ];
  
    for (let [a, b, c] of wins) {
      if (
        cells[a].textContent &&
        cells[a].textContent === cells[b].textContent &&
        cells[a].textContent === cells[c].textContent
      ) {
        document.body.innerHTML = `<div>Game Over - ${cells[a].textContent} wins!</div>`;
        return true;
      }
    }
  
    return false;
}
  

function createCell() {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.addEventListener('click', () => handleMove(cell), { once: true });
  return cell;
}

function handleMove(cell) {
  // check if game ended before passing the chance to other person
  if(gameOver()){
    return
  }
  else{
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer === 'X' ? 'red-x' : 'blue-o', 'animate');
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
}

function setupBoard() {
  for (let i = 0; i < 9; i++) {
    board.appendChild(createCell());
  }
}

setupBoard();

binary();
