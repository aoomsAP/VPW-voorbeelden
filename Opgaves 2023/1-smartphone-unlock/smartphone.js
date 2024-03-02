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


function createGrid(rows, columns) {
    let grid = [];
    let point = 1;
    for (let i = 0; i < rows; i++) {
        let row = []
        for (let j = 0; j < columns; j++) {
            row.push({
                point: point,
                position: { row: i, column: j },
                visited: false,
            });
            point++;
        }
        grid.push(row);
    }
    return grid;
}


function addPositionsToPattern(tests) {
    return tests.map(test => {
        let grid = createGrid(test.rows, test.columns);

        let patternWithPositions = test.pattern.map(point => {

            let position;
            for (let i = 0; i < grid.length; i++) {
                for (let j = 0; j < grid[0].length; j++) {
                    if (grid[i][j].point === point) position = grid[i][j].position;
                }
            }

            return { point: point, position: position }
        })

        let newTest = {
            rows: test.rows,
            columns: test.columns,
            patternSize: test.patternSize,
            pattern: patternWithPositions,
        }

        return newTest;
    })
}


function calculateDirection(currentPoint, previousPoint) {
    let currentDirection = '';
    let currentX = currentPoint.position.column;
    let currentY = currentPoint.position.row;
    let previousX = previousPoint.position.column;
    let previousY = previousPoint.position.row;

    let deltaX = currentX - previousX;
    let deltaY = currentY - previousY;

    if (deltaX == 0) {
        currentDirection = 'vertical'
    }
    else if (deltaY == 0) {
        currentDirection = 'horizontal'
    }
    else {
        let angle = (currentY - previousY) / (currentX - previousX);
        currentDirection = `diagonal-${angle}`;
    }
    return currentDirection;
}


function getIntermediatePoints(startX, startY, endX, endY) {
    let intermediatePoints = [];

    let xDifference = endX - startX;
    let yDifference = endY - startY;

    // horizontal
    if (xDifference == 0) {
        for (let point = Math.min(startY, endY) + 1; point < Math.max(startY, endY); point++) {
            intermediatePoints.push({ x: endX, y: point })
        }
    }
    // vertical
    else if (yDifference == 0) {
        for (let point = Math.min(startX, endX) + 1; point < Math.max(startX, endX); point++) {
            intermediatePoints.push({ x: point, y: endY })
        }
    }
    // diagonal
    else {
        let slope = yDifference / xDifference;

        for (let x = Math.min(startX, endX) + 1; x < Math.max(startX, endX); x++) {
            let y = (x - startX) * slope + startY;

            if (y % 1 == 0) {
                intermediatePoints.push({ x: x, y: y });
            }
        }
    }

    return intermediatePoints;
}

function isPatternValid(pattern) {

    // keep track of all starting points and end points
    const startPoints = new Set();
    const endPoints = new Set();

    function isValidMove(currentX, currentY, nextX, nextY) {

        // if current point has been starting point, move is not valid
        const start = `${currentX},${currentY}`;
        if (startPoints.has(start)) {
            return false;
        }
        // if current point has NOT been starting point, add current starting point to set
        else {
            startPoints.add(`${currentX},${currentY}`);
        }

        // if next point has been end point before, move is not valid
        const end = `${nextX},${nextY}`;
        if (endPoints.has(end)) {
            return false;
        }
        // if next point has NOT been end point before, add next point to set
        else {
            endPoints.add(`${nextX},${nextY}`);
        }

        // check if any intermediate point has been visited
        let intermediatePoints = getIntermediatePoints(currentX, currentY, nextX, nextY);

        // for every intermediate point, check whether the point has either been a start or end point
        for (let i = 0; i < intermediatePoints.length; i++) {
            if (!(startPoints.has(`${intermediatePoints[i].x},${intermediatePoints[i].y}`)
                || endPoints.has(`${intermediatePoints[i].x},${intermediatePoints[i].y}`))) {
                // if intermediate point has not been visited either way, move is not valid
                return false; 
            }
        }

        // if move has passed all prior tests, move is valid
        return true;
    }

    // go through entire pattern
    for (let i = 1; i < pattern.length; i++) {
        let currentX = pattern[i - 1].position.column;
        let currentY = pattern[i - 1].position.row;
        let nextX = pattern[i].position.column;
        let nextY = pattern[i].position.row;

        // check whether move is valid
        if (!isValidMove(currentX, currentY, nextX, nextY)) {
            // if move is not valid, entire pattern is not valid
            return false;
        }
    }

    // if entire pattern has been traversed without a problem, pattern is valid
    return true;
}

process.on('exit', () => {

    // the index position of each point is added to "pattern" array
    tests = addPositionsToPattern(tests);

    tests.forEach((test, i) => {

        // test whether pattern is valid
        if (isPatternValid(test.pattern)) {

            // get set of all unique angles/directions
            let angles = new Set();

            for (let index = 1; index < test.pattern.length; index++) {
                let previousPoint = test.pattern[index - 1];
                let currentPoint = test.pattern[index];

                // calculate all angles/directions
                let direction = calculateDirection(currentPoint, previousPoint);

                angles.add(direction);
            }

            // calculate complexity
            let complexity = test.pattern.length - 1 + angles.size

            console.log(`${i + 1} ${complexity}`);
        }

        // if pattern is not valid, print "ongeldig patroon"
        else {
            console.log(`${i + 1} ongeldig patroon`);
        }
    });
});