import { createBoard, printBoard, checkWinner, isBoardFull } from './gameLogic';
import * as readline from 'readline';

// Function to play a single turn
export function playTurn(board: string[][], currentPlayer: string, boardDim: number, readInterface: readline.Interface): void {
  //printBoard(board);
  readInterface.question(`${currentPlayer}'s turn. Enter the box number to play (1-${boardDim * boardDim}): `, (boxNumber) => {
    const parsedBoxNumber = parseInt(boxNumber, 10);
    if (isNaN(parsedBoxNumber)) {
        console.log('Invalid move! Input must be a number.');
        playTurn(board, currentPlayer, boardDim, readInterface);
      } else if (parsedBoxNumber < 1 || parsedBoxNumber > boardDim * boardDim) {
        console.log('Invalid move! Box number must be between 1 and ' + boardDim * boardDim + '.');
        playTurn(board, currentPlayer, boardDim, readInterface);
      } else {
        const rowIndex = Math.floor((parsedBoxNumber - 1) / boardDim);
        const colIndex = (parsedBoxNumber - 1) % boardDim;
      
        if (board[rowIndex][colIndex]) {
          console.log('Invalid move! The selected box is already occupied.');
          playTurn(board, currentPlayer, boardDim, readInterface);
        } else {
          board[rowIndex][colIndex] = currentPlayer;
      
          if (checkWinner(board)) {
            console.clear()
            printBoard(board);
            console.log(`${currentPlayer} wins!`);
            readInterface.close();
          } else if (isBoardFull(board)) {
            console.clear()
            printBoard(board);
            console.log("It's a draw!");
            readInterface.close();
          } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            playTurn(board, currentPlayer, boardDim, readInterface);
          }
        }
      }
      
  });
}
