const fs = require("fs");
const input = fs.readFileSync("input3.txt", "utf8");

const lines = input.split("\r\n").slice(1);

// parsing
let count = 1;
let tests = [];
for (let i = 0; i < lines.length; i += 3) {
    tests.push({
        id: count,
        startCapital: +lines[i],
        values: lines[i + 2].split(" ").map(x => +x),
    })
    count++;
}

// calculating
for (let test of tests) {
    let remainingCapital = test.startCapital;

    // initialize first buy
    let buyPrice = test.values[0];
    let shares = Math.floor(remainingCapital / buyPrice);
    remainingCapital -= buyPrice * shares;

    if (test.values.length === 1) {
        remainingCapital = test.startCapital;
    }
    else {
        for (let i = 0; i < test.values.length; i++) {
            // -- buying

            // if current value is lower than buy price,
            // cancel last buy & reset
            if (test.values[i] < buyPrice) {
                remainingCapital += buyPrice * shares;
                buyPrice = test.values[i];
                shares = Math.floor(remainingCapital / buyPrice);
                remainingCapital -= buyPrice * shares;
            }

            // -- selling

            if (test.values[i] > buyPrice) {

                // only sell if next value isn't higher
                // in that case waiting to sell is more lucrative
                if (!(test.values[i + 1] > test.values[i])) {
                    // add gains to remainingCapital
                    remainingCapital += (shares * test.values[i]);

                    // reset buyPrice & shares
                    buyPrice = 1000;
                    shares = 0;
                }
            }
            else {
                // if last value & not sold, then cancel last buy
                if (i === test.values.length - 1) {
                    remainingCapital += buyPrice * shares;
                }
            }
        }
    }

    console.log(test.id + " " + remainingCapital);
}