const ll = require('lazylines');

process.stdin.resume();
const input = new ll.LineReadStream(process.stdin);

let testsAmount = -1;
let tests = [];

let points = [];
let cyclist1 = { name: "", results: [] };
let cyclist2 = { name: "", results: [] };

input.on('line', (l) => {
    let line = ll.chomp(l);

    if (testsAmount == -1) {
        testsAmount = +line;
    }
    else if (points.length == 0) {
        points = line.split(" ").map(x => +x);
    }
    else if (cyclist1.name == "") {
        let c1 = line.split(" ");
        cyclist1 = {
            name: c1[0],
            results: c1.slice(1, undefined).map(x => +x),
        }
    }
    else if (cyclist2.name == "") {
        let c2 = line.split(" ");
        cyclist2 = {
            name: c2[0],
            results: c2.slice(1, undefined).map(x => +x),
        }

        // ------ end of test

        // add to tests array
        tests.push({
            points: points,
            cyclist1: cyclist1,
            cyclist2: cyclist2,
        })

        // reset values
        testsAmount--;
        points = [];
        cyclist1 = { name: "", results: [] };
        cyclist2 = { name: "", results: [] };
    }

    if (testsAmount == 0) process.exit();
});

function moveUntilResult(test, desiredResult = "c1 wins" || "c2 wins" || "ex aequo") {

    let c1result_increase = 0;
    let c2result_increase = 0;

    let c1result_decrease = 0;
    let c2result_decrease = 0;

    let increase = 1;
    let decrease = -1;

    let negativePointError = false;
    let winningMoveFound = false;

    while (!winningMoveFound && increase <= 150) {

        // MOVE UP

        let increasedPoints = test.points.map(x => x + increase);
        for (let i = 0; i < test.cyclist1.results.length; i++) {
            // for each result, get point for that result from points array
            // reduce each result/index with -1, because input starts with 1 instead of 0
            // if point with said result/index is not found, no points are earned, therefore add zero

            c1result_increase += increasedPoints[test.cyclist1.results[i] - 1] || 0;
            c2result_increase += increasedPoints[test.cyclist2.results[i] - 1] || 0;
        }
        switch (desiredResult) {
            case "c1 wins":
                if (c1result_increase > c2result_increase) return increase;
                break;
            case "c2 wins":
                if (c1result_increase < c2result_increase) return increase;
                break;
            case "ex aequo":
                if (c1result_increase == c2result_increase) return increase;
                break;
        }
        // reset values & setup for next move
        c1result_increase = 0; c2result_increase = 0;
        increase++;

        // MOVE DOWN

        // only try to decrease points values if points didn't drop below zero
        let decreasedPoints = [];
        if (!negativePointError) {
            decreasedPoints = test.points.map(x => {
                // if points are decreased to below zero, move is not valid
                if (x + decrease <= 0) negativePointError = true;
                return x + decrease;
            });
        }
        if (!negativePointError) {
            for (let i = 0; i < test.cyclist1.results.length; i++) {
                // for each result, get point for that result from points array
                // reduce each result/index with -1, because input starts with 1 instead of 0
                // if point with said result/index is not found, no points are earned, therefore add zero

                c1result_decrease += decreasedPoints[test.cyclist1.results[i] - 1] || 0;
                c2result_decrease += decreasedPoints[test.cyclist2.results[i] - 1] || 0;
            }
            switch (desiredResult) {
                case "c1 wins":
                    if (c1result_decrease > c2result_decrease) return decrease;
                    break;
                case "c2 wins":
                    if (c1result_decrease < c2result_decrease) return decrease;
                    break;
                case "ex aequo":
                    if (c1result_decrease == c2result_decrease) return decrease;
                    break;
            }
        }
        // reset values & setup for next move
        c1result_decrease = 0; c2result_decrease = 0;
        decrease--;
    }

    return undefined;
}

process.on('exit', () => {
    tests.forEach((test, testIndex) => {

        // calculate RESULT
        // a) cyclist 1 wins
        // b) cyclist 2 wins
        // c) "ex aequo"

        let c1result = 0;
        let c2result = 0;

        for (let i = 0; i < test.cyclist1.results.length; i++) {
            // for each result, get point for that result from points array
            // reduce each result/index with -1, because input starts with 1 instead of 0
            // if point with said result/index is not found, no points are earned, therefore add zero

            c1result += test.points[test.cyclist1.results[i] - 1] || 0;
            c2result += test.points[test.cyclist2.results[i] - 1] || 0;
        }

        // cyclist 1 wins ---------------------------------------------
        if (c1result > c2result) {
            console.log(`${testIndex + 1} ${test.cyclist1.name} wint`);

            // calculate changed results by MOVE
            // 1) win by cyclist 2 because of N move
            // 2) ex aequo because of N move

            let c2Move = moveUntilResult(test, "c2 wins");
            let eMove = moveUntilResult(test, "ex aequo");

            if (c2Move > eMove) {
                if (c2Move != undefined) console.log(`${testIndex + 1} ${test.cyclist2.name} wint door verschuiving met ${c2Move}`);
                if (eMove != undefined) console.log(`${testIndex + 1} ex aequo door verschuiving met ${eMove}`);
            }
            else {
                if (eMove != undefined) console.log(`${testIndex + 1} ex aequo door verschuiving met ${eMove}`);
                if (c2Move != undefined) console.log(`${testIndex + 1} ${test.cyclist2.name} wint door verschuiving met ${c2Move}`);
            }
        }

        // cyclist 2 wins ---------------------------------------------
        else if (c1result < c2result) {
            console.log(`${testIndex + 1} ${test.cyclist2.name} wint`);

            // calculate changed results by MOVE
            // 1) win by cyclist 1 because of N move
            // 2) ex aequo because of N move

            let c1Move = moveUntilResult(test, "c1 wins");
            let eMove = moveUntilResult(test, "ex aequo");

            if (c1Move > eMove) {
                if (c1Move != undefined) console.log(`${testIndex + 1} ${test.cyclist1.name} wint door verschuiving met ${c1Move}`);
                if (eMove != undefined) console.log(`${testIndex + 1} ex aequo door verschuiving met ${eMove}`);
            }
            else {
                if (eMove != undefined) console.log(`${testIndex + 1} ex aequo door verschuiving met ${eMove}`);
                if (c1Move != undefined) console.log(`${testIndex + 1} ${test.cyclist1.name} wint door verschuiving met ${c1Move}`);
            }
        }

        // ex aequo ---------------------------------------------
        else {
            console.log(`${testIndex + 1} ex aequo`);

            // calculate changed results by MOVE
            // 1) win by cyclist 1 because of N move
            // 2) win by cyclist 2 because of N move

            let c1Move = moveUntilResult(test, "c1 wins");
            let c2Move = moveUntilResult(test, "c2 wins");

            if (c1Move > c2Move) {
                if (c1Move != undefined) console.log(`${testIndex + 1} ${test.cyclist1.name} wint door verschuiving met ${c1Move}`);
                if (c2Move != undefined) console.log(`${testIndex + 1} ${test.cyclist2.name} wint door verschuiving met ${c2Move}`);
            }
            else {
                if (c2Move != undefined) console.log(`${testIndex + 1} ${test.cyclist2.name} wint door verschuiving met ${c2Move}`);
                if (c1Move != undefined) console.log(`${testIndex + 1} ${test.cyclist1.name} wint door verschuiving met ${c1Move}`);
            }
        }
    });
});