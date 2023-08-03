import * as readline from 'readline';
import { playTurn } from './gameplay';
import { createBoard, printBoard, checkWinner, isBoardFull } from './gameLogic';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the dimensions of the board (boardDim): ', (dimensions) => {
  const boardDim = parseInt(dimensions, 10);
  if (isNaN(boardDim) || boardDim < 2) {
    console.log('Invalid dimensions! The board size must be in numbers');
    rl.close();
  } else {
    console.log("Welcome to Tic Tac Toe (Built in TypeScript)")
    const board = createBoard(boardDim);
    let currentPlayer = 'X';
    console.log(`Starting Tic Tac Toe (${boardDim}x${boardDim})...`);
    playTurn(board, currentPlayer, boardDim, rl);
  }
});
