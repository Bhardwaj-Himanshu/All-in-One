const restartButton = document.querySelector('.restart');
const chessBoard = document.querySelector('.chess-board');

let squares = [];
// prettier-ignore
let chessPieces = [
  elephant, horse, camel, queen, king, camel, horse, elephant,
  pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
  "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "",
  pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
  elephant, horse, camel, king, queen, camel, horse, elephant,
];

// I want to add 64 squares each of a specified dimension inside the chessBoardSquares
for (let i = 0; i < chessPieces.length; i++) {
  const square = document.createElement('div');
  square.classList.add('square');
  square.setAttribute('id', i);
  square.innerHTML = chessPieces[i];
  const rowNumber = Math.floor((63 - i) / 8) + 1;
  if (rowNumber % 2 == 0) {
    i % 2 == 0
      ? square.classList.add('color-gray')
      : square.classList.add('color-green');
  } else {
    i % 2 == 0
      ? square.classList.add('color-green')
      : square.classList.add('color-gray');
  }
  // if (rowNumber % 2 == 0) {
  //   square.classList.add('color-green');
  // } else {
  //   square.classList.add('color-gray');
  // }

  if (i >= 48) {
    const svgElement = square.firstChild.firstChild;
    svgElement.classList.add('color-svg-white');
  }
  squares.push(square);
  chessBoard.appendChild(square);
}

// Now I want to add color black to every alternate square could be odd numbered or even numbered
// for (let i = 0; i < 8; i++) {
//   for (let j = 0; j < 8; j++) {
//     if ((i + j) % 2 === 0) {
//       squares[i * 8 + j].classList.add('color-green');
//     } else {
//       squares[i * 8 + j].classList.add('color-gray');
//     }
//   }
// }

// console.log({ squares });
/* EVENT LISTENERS */
squares.forEach((square) => {
  square.addEventListener('click', (e) => {
    // console.log(e.target.id);
    // console.log(e);
    switch (
      e.target.parentElement.id ||
      e.target.parentElement.parentElement.id
    ) {
      case 'pawn':
        // squares[Number(square.id) + 8].classList.toggle('highlighted');
        // squares[Number(square.id) + 16].classList.toggle('highlighted');
        break;
      default:
        break;
    }
  });
});

// console.log(squares);
