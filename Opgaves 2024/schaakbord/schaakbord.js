const ll = require('lazylines');

process.stdin.resume();
const input = new ll.LineReadStream(process.stdin);

let testsAmount = 0;
let testIndex = 1;
let startPosition = "";
let board = [];
let tests = [];


input.on('line', (l) => {
    let line = ll.chomp(l);

    if (testsAmount == 0) {
        testsAmount = +line;
    }
    else if (startPosition == "") {
        startPosition = line.split(" ")[0];
        let alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
        let boardSize = +line.split(" ")[1];

        // wrong start
        if (+startPosition.substring(1) > boardSize) {
            console.log(`${testIndex} foute start`);
        }
        // wrong bord
        else if (boardSize > 25 || boardSize < 4) {
            console.log(`${testIndex} bordfout`);
        }
        // good movies
        else {
            let board = [];

            for (let i = 0; i < boardSize; i++) {
                board[i] = [];
                for (let j = 0; j < boardSize; j++) {
                    board[i].push(alphabet[j] + (j+1));
                }
            }

            // calculate good moves

            let goodMoves = [];

            for (let row = 1; row <= board.length; row++) {
                for (let col = 1; col <= board[0].length; col++) {

                    let startColIndex = +startPosition.substring(1);
                    let startRowIndex = alphabet.indexOf(startPosition.substring(0,1))+1;

                    // 1
                    if (row == startRowIndex + 1 && col == startColIndex + 2) {
                        if (!checkOutOfBounds(row, col, boardSize)) {
                            goodMoves.push(`${alphabet[row-1]}${col}`);
                        }
                    }

                    // 2
                    if (row == startRowIndex - 1 && col == startColIndex + 2) {
                        if (!checkOutOfBounds(row, col, boardSize)) {
                            goodMoves.push(`${alphabet[row-1]}${col}`);
                        }
                    }

                    // 3
                    if (row == startRowIndex + 2 && col == startColIndex + 1) {
                        if (!checkOutOfBounds(row, col, boardSize)) {
                            goodMoves.push(`${alphabet[row-1]}${col}`);
                        }
                    }

                    // 4
                    if (row == startRowIndex - 2 && col == startColIndex + 1) {
                        if (!checkOutOfBounds(row, col, boardSize)) {
                            goodMoves.push(`${alphabet[row-1]}${col}`);
                        }
                    }

                    // 5
                    if (row == startRowIndex + 1 && col == startColIndex - 2) {
                        if (!checkOutOfBounds(row, col, boardSize)) {
                            goodMoves.push(`${alphabet[row-1]}${col}`);
                        }
                    }

                    // 6
                    if (row == startRowIndex - 1 && col == startColIndex - 2) {
                        if (!checkOutOfBounds(row, col, boardSize)) {
                            goodMoves.push(`${alphabet[row-1]}${col}`);
                        }
                    }

                    // 7
                    if (row == startRowIndex - 2 && col == startColIndex - 1) {
                        if (!checkOutOfBounds(row, col, boardSize)) {
                            goodMoves.push(`${alphabet[row-1]}${col}`);
                        }
                    }

                    // 8
                    if (row == startRowIndex + 2 && col == startColIndex - 1) {
                        if (!checkOutOfBounds(row, col, boardSize)) {
                            goodMoves.push(`${alphabet[row-1]}${col}`);
                        }
                    }
                }
            }

            let allGoodMoves = goodMoves.join(" ").trimEnd();
            console.log(`${testIndex} ${allGoodMoves}`);
        }
        testIndex++;
        testsAmount--;
        startPosition= "";
    }

    if (testsAmount == 0) process.exit();
});

function checkOutOfBounds(row, col, boardSize) {
    return row > boardSize || col > boardSize || row < 0 || col < 0
}

// process.on('exit', () => {
//     tests.forEach((test, testIndex) => {

//         // check if startposition is outside board (> 25 || > boardSize)







//         console.log(`${testIndex + 1} ${test}`);
//     });
// });