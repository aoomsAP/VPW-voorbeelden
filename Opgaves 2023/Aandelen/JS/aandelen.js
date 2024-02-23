const ll = require("lazylines");
process.stdin.resume();
const input = new ll.LineReadStream(process.stdin);

let numberOfTests = 0;
let numberOfValues = null;
let startCapital = null;
let tests = [];

input.on("line", l => {
    const line = ll.chomp(l);

    if (numberOfTests == 0) {
        numberOfTests = +line;
    }
    else {

        if (startCapital == null) {
            startCapital = +line;
        }
        else if (numberOfValues == null) {
            numberOfValues = +line;
        }
        else {
            let values = line.split(" ").map(x => +x);
            let test = {
                startCapital: startCapital,
                values: values,
            }
            tests.push(test);

            startCapital = null;
            numberOfValues = null;
            numberOfTests--;
        }
    }

    if (numberOfTests === 0) {
        process.exit();
    }
})

function calc(test) {
    let remainingCapital = test.startCapital;

    // initialize first buy
    let buyPrice = test.values[0];
    let shares = Math.floor(remainingCapital / buyPrice);
    remainingCapital -= buyPrice * shares;

    if (test.values.length === 1) {
        // if there is only one value, nothing will be bought or sold
        // the end capital will be the start capital
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

    return remainingCapital;
}

process.on("exit", () => {
    tests.forEach((test, i) => {
        console.log(`${i + 1} ${calc(test)}`);
    })
})