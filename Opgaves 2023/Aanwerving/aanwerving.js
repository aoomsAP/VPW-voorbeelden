const fs = require("fs");
const input = fs.readFileSync("wedstrijd.txt", "utf8");

const lines = input.split("\n").slice(1).filter(x => x != "");

// parsing
let tests = [];
for (let i = 0; i < lines.length; i += 2) {
    tests.push({
        programmers: +lines[i].split(" ")[0], // 1-1000
        testRound: +lines[i].split(" ")[1], // 1-2000
        scores: lines[i + 1].split(" ").map(x => +x), // 1-2000
    })
}

// calculation
tests.forEach((test,index) => {
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
        if (programmer === undefined && i === test.scores.length-1) {
            programmer = {
                index: i,
                score: test.scores[i],
            }
        }
    }

    // index (1) + index programmer (1) + score
    console.log(`${index+1} ${programmer.index+1} ${programmer.score}`);
});