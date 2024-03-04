const ll = require('lazylines');

process.stdin.resume();
const input = new ll.LineReadStream(process.stdin);

let testsAmount = 0;
let tests = [];
let numberOfVisitors = -1;
let visitors = [];

input.on('line', (l) => {
    let line = ll.chomp(l);

    if (testsAmount == 0) {
        testsAmount = +line;
    }
    else if (numberOfVisitors == -1) {
        numberOfVisitors = +line;
    }
    else {
        visitors = line.split(" ").map(x => +x);

        // ---------- end of test
        // push current values to tests
        tests.push({
            numberOfVisitors: numberOfVisitors,
            visitors: visitors,
        })

        // reset values
        numberOfVisitors = -1;
        visitors = [];
        testsAmount--;
    }

    if (testsAmount == 0) process.exit();
});

const greatestCommonDivisor = (a, b) => {
    if (!b) return a;
    return greatestCommonDivisor(b, a % b);
}

function leastCommonMultiple(a, b) {
    let gcd = greatestCommonDivisor(a, b);
    return (a * b) / gcd;
}

process.on('exit', () => {
    tests.forEach((test, testIndex) => {

        // all unique visitors
        let allVisitors = new Set([...test.visitors].sort((a, b) => a - b));

        // for each unique visitor
        for (let [visitorIndex, visitor] of allVisitors.entries()) {
            // get index of arrival and index of leaving
            let arrival = test.visitors.indexOf(visitor);
            let leaving = test.visitors.indexOf(visitor, arrival + 1);

            // how many visitors are at restaurant at time of arrival
            let trafficAtArrival = test.visitors.slice(undefined, arrival);
            let visitorsAtArrival = [];
            let uniqueVisitors = new Set(trafficAtArrival);
            // for each unique visitor at the time of arrival,
            // check whether they appear only once or twice in the traffic
            // if they appear twice, it means they already left
            // and are not part of the current visitors at time of arrival
            [...Array.from(uniqueVisitors)].forEach((prevVisitor) => {
                if (!trafficAtArrival.slice(trafficAtArrival.indexOf(prevVisitor) + 1).includes(prevVisitor)) {
                    visitorsAtArrival.push(prevVisitor);
                }
            })
            let currentVisitors = visitorsAtArrival.length;

            // discount logic = 1/(Math.pow(2,currentVisitors)
            let firstDiscount = true;
            let numerator = 0;
            let denominator = 0;
            let divisor = 0;

            let visitorsAfterArrival = [];
            // add new discount for each new visitor, until current visitor leaves
            for (let i = arrival + 1; i < leaving; i++) {

                // if next visitor is current visitor, it means current visitor is leaving
                if (test.visitors[i] == visitor) {
                    break;
                }

                // if next visitor is included in the visitors at arrival,
                // or next visitor is included in the visitors after arrival,
                // it means this visitor is not newly arriving,
                // but that this visitor is leaving (and should be excluded from count)
                let newVisitor = !visitorsAtArrival.includes(test.visitors[i])
                    && !visitorsAfterArrival.includes(test.visitors[i]);

                if (newVisitor) {
                    // add new visitor to current visitors
                    currentVisitors++;
                    visitorsAfterArrival.push(test.visitors[i]);

                    // ------------------- add discount

                    if (firstDiscount) {
                        numerator = 1;
                        denominator = Math.pow(2, currentVisitors);
                        firstDiscount = false;
                    }
                    else {
                        // to add two fractions with unlike denominators (e.g. 1/3 + 1/19)
                        // we have to find the least common multiple (e.g. 57)
                        // so we can turn them into fractions with the same denominator (e.g. 19/57 + 3/57 = 22/57)

                        let newNumerator = 1;
                        let newDenominator = Math.pow(2, currentVisitors);

                        let lcm = leastCommonMultiple(denominator, newDenominator);

                        // make sure fractions have the same denominator
                        let oldNum = numerator * (lcm / denominator);
                        let newNum = newNumerator * (lcm / newDenominator);

                        // now we are able to add to the fractions together
                        numerator = (oldNum + newNum);
                        denominator = lcm;

                        // immediately reduce fraction to smallest possible fraction
                        // for which we need the greatest common divisor
                        divisor = greatestCommonDivisor(numerator, denominator);
                        numerator /= divisor;
                        denominator /= divisor;
                    }
                }
                else {
                    // if it's not a new visitor, it's a visitor that is leaving
                    // so currentVisitors should be reduced
                    currentVisitors--;
                }
            }

            let fraction = "";
            if (numerator / denominator > 73 / 100) fraction = "73/100";
            else if (numerator == 0 && denominator == 0) fraction = "0";
            else fraction = `${numerator}/${denominator}`;

            // output discount for each visitor in a test
            console.log(`${testIndex + 1} ${visitorIndex} ${fraction}`);
        }
    });
});