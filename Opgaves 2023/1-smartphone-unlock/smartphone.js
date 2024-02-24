const ll = require('lazylines');

process.stdin.resume();
const input = new ll.LineReadStream(process.stdin);

let testsAmount = 0;
let rows = -1;
let columns = -1;
let patternSize = -1;
let pattern = [];

let tests = [];

input.on('line', (l) => {
    let line = ll.chomp(l);

    if (testsAmount == 0) {
        testsAmount = +line;
    }
    else {
        if (rows == -1 && columns == -1) {
            rows = +line.split(" ")[0];
            columns = +line.split(" ")[1];
        }
        else if (patternSize == -1) {
            patternSize = +line;
        }
        else {
            pattern = line.split(" ").map(x => +x);

            if (pattern.length == patternSize) {
                tests.push({
                    rows: rows,
                    columns: columns,
                    patternSize: patternSize,
                    pattern: pattern,
                })

                testsAmount--;
                rows = -1;
                columns = -1;
                patternSize = -1;
                pattern = [];
            }
        }
    }

    if (testsAmount == 0) process.exit();
});

function drawGrid(rows, columns) {
    let grid = [];
    let count = 1;
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < columns; j++) {
            row.push({
                point: count,
                position: { rowIndex: i, columnIndex: j },
                visited: false
            });
            count++;
        }
        grid.push(row);
    }
    return grid;
}

function isPatternValid(test) {
    // point is allowed to be starting point once & end point once

    // if lines intersect with a point, it needs to have been visited before
}

process.on('exit', () => {
    tests.forEach((test, i) => {

        const grid = drawGrid(test.rows, test.columns);

        // traversing grid
        pattern.forEach(point => {

            for (let x = 0; x < grid.length; x++) {
                for (let y = 0; y < grid[0].length; y++) {
                    if (grid[x][y] == point) {

                        if (grid[x][y].visited == true) return false;

                        grid[x][y].visited = true;
                    }
                }
            }
        })

        console.log(test);
        console.log(`${i + 1} ${test}`);
    });
});