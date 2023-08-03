// Function to create a 2D array of size N x N with initial values
export function createBoard(N: number): string[][] {
    const board: string[][] = [];
    for (let i = 0; i < N; i++) {
      board.push(new Array(N).fill(''));
    }
    return board;
  }

  // Function to print the current state of the board
  export function printBoard(board:string[][]):void{
    const boardDim = board.length
    for (let row = 0;row<boardDim;row++){
        console.log(board[row].map(cell=>cell || "").join(" || "))
        if (row < boardDim -1) console.log('-'.repeat(boardDim * 4 + (boardDim- 1)))
    }
  }
  
  
  // Function to check if there is a winner
 export function checkWinner(board: string[][]): boolean {
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

  export function isBoardFull(board:string[][]):boolean
  {
    return board.every(row=>row.every(cell=>cell))
  }

  