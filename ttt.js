"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var console_1 = require("console");
//clear screen function
function clearScreen() {
    (0, console_1.clear)();
}
// Function to create a 2D array of size N x N with initial values
function createBoard(N) {
    var board = [];
    for (var i = 0; i < N; i++) {
        board.push(new Array(N).fill(''));
    }
    return board;
}
// Function to print the current state of the board
function printBoard(board) {
    var boardSize = board.length;
    for (var row = 0; row < boardSize; row++) {
        console.log(board[row].map(function (cell) { return cell || ' '; }).join(' || '));
        if (row < boardSize - 1) {
            console.log('-'.repeat(boardSize * 4 + (boardSize - 2)));
        }
    }
}
function checkWinner(board) {
    var boardDim = board.length;
    // Check rows
    for (var i = 0; i < boardDim; i++) {
        var rowWin = true;
        for (var j = 1; j < boardDim; j++) {
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
    var mainDiagonalWin = true;
    for (var i = 1; i < boardDim; i++) {
        if (board[i][i] !== board[0][0] || !board[0][0]) {
            mainDiagonalWin = false;
            break;
        }
    }
    if (mainDiagonalWin) {
        return true; // Top-left to bottom-right diagonal a winner
    }
    // Check columns
    for (var i = 0; i < boardDim; i++) {
        var colWin = true;
        for (var j = 1; j < boardDim; j++) {
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
    var secondDiagonalWin = true;
    for (var i = 1; i < boardDim; i++) {
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
function isBoardFull(board) {
    return board.every(function (row) { return row.every(function (cell) { return cell; }); });
}
// Function to play a single turn
function playTurn(board, currentPlayer, boardDim, rl) {
    clearScreen();
    printBoard(board);
    rl.question("".concat(currentPlayer, "'s turn. Enter the box number to play (1 - ").concat(boardDim * boardDim, "): "), function (boxNumber) {
        var parsedBoxNumber = parseInt(boxNumber, 10);
        if (isNaN(parsedBoxNumber) || parsedBoxNumber < 1 || parsedBoxNumber > boardDim * boardDim || board[Math.floor((parsedBoxNumber - 1) / boardDim)][(parsedBoxNumber - 1) % boardDim]) {
            console.log('Invalid move! Try again.');
            playTurn(board, currentPlayer, boardDim, rl);
        }
        else {
            var rowIndex = Math.floor((parsedBoxNumber - 1) / boardDim);
            var colIndex = (parsedBoxNumber - 1) % boardDim;
            board[rowIndex][colIndex] = currentPlayer;
            if (checkWinner(board)) {
                printBoard(board);
                console.log("".concat(currentPlayer, " wins!"));
                rl.close();
            }
            else if (isBoardFull(board)) {
                printBoard(board);
                console.log("It's a draw!");
                rl.close();
            }
            else {
                //change players
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                //clearScreen()
                playTurn(board, currentPlayer, boardDim, rl);
            }
        }
    });
}
//main
function playTicTacToe(boardDim) {
    var board = createBoard(boardDim);
    var currentPlayer = 'X';
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    console.log("Starting Tic Tac Toe (".concat(boardDim, "x").concat(boardDim, ")..."));
    playTurn(board, currentPlayer, boardDim, rl);
}
// Get dimensions from the user
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question('Enter the dimensions of the board (boardDim): ', function (dimensions) {
    var boardDim = parseInt(dimensions, 10);
    if (isNaN(boardDim) || boardDim < 2) {
        console.log('Invalid dimensions! The board size must be in numbers');
        rl.close();
    }
    else {
        clearScreen();
        console.log("Welcome to Tic Tac Toe (Built in TypeScript)");
        playTicTacToe(boardDim);
    }
});
