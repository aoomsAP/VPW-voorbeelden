var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let numberOfTests = 0;
let numberOfValues = null;
let startCapital = null;
let tests = [];

rl.on('line', function(l){
    const line = l.replace("\n","").replace("\r","");

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
    let remainingCapital = BigInt(test.startCapital);

    // if there's no values or only one value, there won't be any buying/selling
    if (test.values.length == 0 || test.values.length == 1) {
        return BigInt(test.startCapital);
    }

    // initialize first buy
    let buyPrice = BigInt(test.values[0]);
    let shares = BigInt(remainingCapital / buyPrice);
    remainingCapital -= buyPrice * shares;

    for (let i = 0; i < test.values.length; i++) {
        let currentValue = BigInt(test.values[i]);
        let nextValue = i != test.values.length-1 ? BigInt(test.values[i + 1]) : 0;

        // -- buying

        // if current value is lower than buy price,
        // cancel last buy & reset
        if (currentValue < buyPrice) {
            remainingCapital += BigInt(buyPrice * shares);
            buyPrice = currentValue;
            shares = remainingCapital / buyPrice;
            remainingCapital -= buyPrice * shares;
        }

        // -- selling

        if (currentValue > buyPrice) {

            // only sell if next value isn't higher
            // in that case waiting to sell is more lucrative
            if (!(nextValue > currentValue)) {
                // add gains to remainingCapital
                remainingCapital += BigInt(shares * currentValue);

                // reset buyPrice & shares
                buyPrice = 1000;
                shares = 0;
            }
        }
        else {
            // if last value & not sold, then cancel last buy
            if (i === test.values.length - 1) {
                remainingCapital += BigInt(buyPrice * shares);
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