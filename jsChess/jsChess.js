const restartButton = document.querySelector('.restart');
const chessBoard = document.querySelector('.chess-board');

let squares = [];
// I want to add 64 squares each of a specified dimension inside the chessBoardSquares
for (let i = 0; i < 64; i++) {
  const square = document.createElement('div');
  square.classList.add('square');
  squares.push(square);
  chessBoard.appendChild(square);
}
// Now I want to add color black to every alternate square could be odd numbered or even numbered
for (let i = 0; i < 8; i++) {
  for (let j = 0; j < 8; j++) {
    if ((i + j) % 2 === 0) {
      squares[i * 8 + j].classList.add('color-black'); // Add color class for black squares
    }
  }
}
