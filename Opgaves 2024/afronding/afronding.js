const ll = require('lazylines');

process.stdin.resume();
const input = new ll.LineReadStream(process.stdin);

let testsAmount = -1;
let numberOfPrices = -1;
let prices = [];
let tests = [];

input.on('line', (l) => {
    let line = ll.chomp(l);

    if (testsAmount == -1) {
        testsAmount = +line;
    }
    else if (numberOfPrices == -1) {
        numberOfPrices = +line;
    }
    else {
        prices = line.split(" ").map(x => +x.replace(",", "."));

        tests.push({
            numberOfPrices: numberOfPrices,
            prices: prices,
        })

        testsAmount--;
        numberOfPrices = -1;
    }

    if (testsAmount == 0) process.exit();
});

function afgerondePrijs(price) {
    let priceString = price.toString();
    let numbersBeforeComma = +priceString.split(".")[0];
    let decimal = priceString.split(".")[1] || "00";
    let firstDecimal = +decimal.substring(0, 1);
    let lastDecimal = +decimal.substring(1,2);

    function overflow() {
        if (firstDecimal != 9) {
            firstDecimal++;
        }
        else {
            firstDecimal = 0;
            numbersBeforeComma++;
        }
    }

    switch (lastDecimal) {
        case 0:
            break;
        case 1:
        case 2:
            lastDecimal = 0;
            break;
        case 3:
        case 4:
        case 6:
        case 7:
            lastDecimal = 5;
            break;
        case 8:
        case 9:
            lastDecimal = 0;
            overflow();
    }

    return numbersBeforeComma+"."+firstDecimal+lastDecimal;
}

process.on('exit', () => {
    tests.forEach((test, testIndex) => {

        // som van de prijzen
        let sumOfPrices = test.prices.reduce((prev, curr) => (prev + curr), 0);
        let stringOfSum = sumOfPrices.toString();
        let sumString = stringOfSum.substring(0,stringOfSum.indexOf(".")+3);

        // som van de prijzen, afgerond
        let roundedPrice = afgerondePrijs(+sumString);

        // som van de /afgeronde/ prijzen
        let sumOfRoundedPrices = 0;
        for (let price of test.prices) {
            sumOfRoundedPrices+=(+afgerondePrijs(price));
        }

        console.log(`${testIndex + 1} ${sumString.replace(".",",")} ${roundedPrice.replace(".",",")} ${afgerondePrijs(sumOfRoundedPrices).replace(".",",")}`);
    });
});