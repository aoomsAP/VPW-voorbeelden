const ll = require('lazylines');

process.stdin.resume();
const input = new ll.LineReadStream(process.stdin);

let testsAmount = 0;
let tests = [];

let totalRows = null;
let grid = [];
let numberOfSteps = null;
let steps = [];

input.on('line', (l) => {
    let line = ll.chomp(l);

    if (testsAmount == 0) {
        // first line: amount of tests
        testsAmount = +line;
    }
    else if (totalRows == null) {
        // line: total rows, total columns
        totalRows = +line.split(" ")[0];
    }
    else {
        if (grid.length != totalRows) {
            // line: grid row
            const row = line.split("").map(x => ({ value: x, visited: false }))
            grid.push(row);
        }
        else {

            if (numberOfSteps == null) {
                // line: number of steps
                numberOfSteps = +line;
            }
            else {
                // line: step
                steps.push({
                    rowIndex: +line.split(" ")[0] - 1,
                    columnIndex: +line.split(" ")[1] - 1,
                    type: line.split(" ")[2]
                })

                if (steps.length == numberOfSteps) {
                    // test done
                    tests.push({
                        grid: grid,
                        steps: steps,
                    })

                    // reset values
                    totalRows = null;
                    grid = [];
                    numberOfSteps = null;
                    steps = [];
                    testsAmount--;
                }
            }
        }
    }

    if (testsAmount == 0) process.exit();
});

// calculation
function markIsland(step) {
    let x = step.columnIndex;
    let y = step.rowIndex;
    const groupValue = grid[y][x].value;

    // fucking dfs (depth first search)
        // Rep  => I like this implementation (but didn't know it was called depth first search)
    function dfs(y, x) {
        if (
            y >= 0 &&
            x >= 0 &&
            y < grid.length &&
            x < grid[0].length &&
            grid[y][x].value === groupValue &&
            grid[y][x].visited === false
        ) {
            grid[y][x].value = CalculateSquare(grid[y][x].value, step.type);
            grid[y][x].visited = true;
            dfs(y, x - 1); // left
            dfs(y, x + 1); // right
            dfs(y - 1, x); // up
            dfs(y + 1, x); // down
        }
    }
    dfs(y, x);

    // reset the visited state
    grid.forEach((row)=>{
        row.forEach((cel)=>{
            cel.visited = false;
        })
    })
}

function CalculateSquare(squareString, type){

    let squareValue = parseInt(squareString, 16);

    if (type === "+") squareValue = Math.min((squareValue+1), 15);
    else squareValue = Math.max((squareValue-1), 0);
    
    return squareValue.toString(16).toUpperCase();
}

process.on('exit', () => {
    tests.forEach((test, testIndex) => {

        //reuse the grid variable
        grid = test.grid;
        // refactor grid
        test.steps.forEach(step => {
            // mark cells as visited
            markIsland(step);
        })
        test.grid = grid;

        // index (1) + each line of grid
        test.grid.forEach(line => {
            console.log(`${testIndex + 1} ${line.map(x => x.value).join("")}`);
        })
    })
});