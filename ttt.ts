import * as readline from 'readline';

import { clear } from "console";

//clear screen function
function clearScreen():void{
    clear()
}

// Function to create a 2D array of size N x N with initial values
function createBoard(N: number): string[][] {
  const board: string[][] = [];
  for (let i = 0; i < N; i++) {
    board.push(new Array(N).fill(''));
  }
  return board;
}

// Function to print the current state of the board
function printBoard(board: string[][]): void {
  const boardSize = board.length;
  for (let row = 0; row < boardSize; row++) {
    console.log(board[row].map(cell => cell || ' ').join(' || '));
    if (row < boardSize - 1) {
      console.log('-'.repeat(boardSize * 4 + (boardSize - 2)));
    }
  }
}

function checkWinner(board: string[][]): boolean {
  const boardDim = board.length;

  // Check rows
  for (let i = 0; i < boardDim; i++) {
    let rowWin = true;
    for (let j = 1; j < boardDim; j++) {
      if (board[i][j] !== board[i][0] || !board[i][0]) {
        rowWin = false;
        break;
      }
    }
    if (rowWin) {
      return true; // Winner in row i
    }
  }

  //top-left to bottom-right diagonal
  let mainDiagonalWin = true;
  for (let i = 1; i < boardDim; i++) {
    if (board[i][i] !== board[0][0] || !board[0][0]) {
      mainDiagonalWin = false;
      break;
    }
  }
  if (mainDiagonalWin) {
    return true; // Top-left to bottom-right diagonal a winner
  }

  // Check columns
  for (let i = 0; i < boardDim; i++) {
    let colWin = true;
    for (let j = 1; j < boardDim; j++) {
      if (board[j][i] !== board[0][i] || !board[0][i]) {
        colWin = false;
        break;
      }
    }
    if (colWin) {
      return true; // Winner in column i
    }
  }
  // Check 
  
  // Check top-right to bottom-left diagonal
  let secondDiagonalWin = true;
  for (let i = 1; i < boardDim; i++) {
    if (board[i][boardDim - 1 - i] !== board[0][boardDim - 1] || !board[0][boardDim - 1]) {
      secondDiagonalWin = false;
      break;
    }
  }
  if (secondDiagonalWin) {
    return true; // Top-right to bottom-left diagonal i a winner
  }

  return false;
}


// Board Full
function isBoardFull(board: string[][]): boolean {
  return board.every(row => row.every(cell => cell));
}

// Function to play a single turn
function playTurn(board: string[][], currentPlayer: string, boardDim: number, readInterface: readline.Interface): void {
  clearScreen()
  printBoard(board);
  readInterface.question(`${currentPlayer}'s turn. Enter the box number to play (1 - ${boardDim * boardDim}): `, (boxNumber) => {
    const parsedBoxNumber = parseInt(boxNumber, 10);
    if (isNaN(parsedBoxNumber) || parsedBoxNumber < 1 || parsedBoxNumber > boardDim * boardDim || board[Math.floor((parsedBoxNumber - 1) / boardDim)][(parsedBoxNumber - 1) % boardDim]) {
      console.log('Invalid move! Try again.');
      playTurn(board, currentPlayer, boardDim, readInterface);
    } else {
      const rowIndex = Math.floor((parsedBoxNumber - 1) / boardDim);
      const colIndex = (parsedBoxNumber - 1) % boardDim;
      board[rowIndex][colIndex] = currentPlayer;
      

      if (checkWinner(board)) {
        printBoard(board);
        console.log(`${currentPlayer} wins!`);
        readInterface.close();
      } else if (isBoardFull(board)) {
        printBoard(board);
        console.log("It's a draw!");
        readInterface.close();
      } else {

        //change players

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        //clearScreen()
        playTurn(board, currentPlayer, boardDim, readInterface);
        
      }
    }
  });
}

//main
function playTicTacToe(boardDim: number): void {
  const board = createBoard(boardDim);
  let currentPlayer = 'X';

  const readInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  console.log(`Starting Tic Tac Toe (${boardDim}x${boardDim})...`);
  playTurn(board, currentPlayer, boardDim, readInterface);
}

// Get dimensions from the user
const readInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

readInterface.question('Enter the dimensions of the board (boardDim): ', (dimensions) => {
  const boardDim = parseInt(dimensions, 10);
  if (isNaN(boardDim) || boardDim < 2) {
    console.log('Invalid dimensions! The board size must be in numbers');
    readInterface.close();
  } else {
    clearScreen()
    console.log("Welcome to Tic Tac Toe (Built in TypeScript)")
    playTicTacToe(boardDim);
  }
});
