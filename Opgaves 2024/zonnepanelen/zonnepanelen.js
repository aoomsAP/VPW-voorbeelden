const ll = require('lazylines');

process.stdin.resume();
const input = new ll.LineReadStream(process.stdin);

let testsAmount = 0;
let sumLength = -1;
let numberOfResults = -1;
let measurements = [];
let tests = [];

input.on('line', (l) => {
    let line = ll.chomp(l);

    if (testsAmount == 0) {
        testsAmount = +line;
    }
    else if (sumLength == -1) {
        sumLength = +line
    }
    else if (numberOfResults == -1) {
        numberOfResults = +line;
    }
    else {
        measurements = line.split(" ").map(x => +x);

        tests.push({
            sumLength: sumLength,
            numberOfResults: numberOfResults,
            measurements: measurements,
        })

        sumLength = -1;
        numberOfResults = -1;
        measurements = [];
        testsAmount--;
    }

    if (testsAmount == 0) process.exit();
});

process.on('exit', () => {
    tests.forEach((test, testIndex) => {

        let output = testIndex+1;

        for (let i = 0; i+test.sumLength <= test.measurements.length; i++) {

            let slice = test.measurements.slice(i,i+test.sumLength);
            let sum = slice.reduce((prev,curr) => prev+curr,0);
            output += " " + sum;
        }
        console.log(`${output}`);
    });
});