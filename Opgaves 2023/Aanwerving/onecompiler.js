var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let testsAmount = 0;
let programmers = null;
let testRound = null;
let tests = [];

rl.on('line', function(l){
    let line = l.replace("\n","").replace("\r","");

    if (testsAmount == 0) {
        testsAmount = +line;
    }
    else if (programmers == null && testRound == null) {
        programmers = line.split(" ").map(x => +x)[0];
        testRound = line.split(" ").map(x => +x)[1];
    }
    else {
        let scores = line.split(" ").map(x => +x);
        // console.log("programmers",programmers);
        // console.log("scores",scores.length);
        tests.push({
            programmers: programmers, // 1-1000
            testRound: testRound, // 1-2000
            scores: scores // 1-2000
        });

        programmers = null; testRound = null;
        testsAmount--;
    }

    if (testsAmount == 0) process.exit();
});

process.on('exit', () => {
    tests.forEach((test, i) => {
        // get high score
        let highestScore = 0;
        for (let i = 0; i < test.testRound; i++) {
            if (test.scores[i] > highestScore) highestScore = test.scores[i];
        }

        let programmer;
        for (let i = test.testRound; i < test.scores.length; i++) {
            // hire first programmer that equals/surpasses highest score
            if (programmer === undefined && test.scores[i] >= highestScore) {
                programmer = {
                    index: i,
                    score: test.scores[i],
                }
            }
            // if no programmer hired by the end, hire last one
            if (programmer === undefined && i === test.scores.length - 1) {
                programmer = {
                    index: i,
                    score: test.scores[i],
                }
            }
        }

        // index (1) + index programmer (1) + score
        console.log(`${i + 1} ${programmer.index + 1} ${programmer.score}`);
    });
});