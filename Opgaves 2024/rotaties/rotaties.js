const ll = require('lazylines');

process.stdin.resume();
const input = new ll.LineReadStream(process.stdin);

let testsAmount = 0;
let tests = [];

input.on('line', (l) => {
    let line = ll.chomp(l);

    if (testsAmount == 0) {
        testsAmount = +line;
    }
    else {
        let housesAmount = +line.split(" ")[0];
        let houses = line.split(" ").slice(1);

        tests.push({
            housesAmount: housesAmount,
            houses: houses,
        })
        testsAmount--;
    }

    if (testsAmount == 0) process.exit();
});

function calculateCost(currentHouseColor, colorWeWantToChangeItTo) {
    if (currentHouseColor == colorWeWantToChangeItTo) return 0;
    if (currentHouseColor == "G") return 1;
    if (currentHouseColor == "Z" && colorWeWantToChangeItTo == "W") return 2;
    if (currentHouseColor == "W" && colorWeWantToChangeItTo == "Z") return 1;

}

process.on('exit', () => {tests.forEach((test, testIndex) => {

        // if all houses are one color, print 0
        let uniqueHouses = new Set(test.houses);
        if (uniqueHouses.size == 1) {
            console.log(`${testIndex + 1} 0`)
        }
        else {
            let lowestCost = 13490904930493;

            for (let houseIndex = 0; houseIndex < test.houses.length; houseIndex++) {
                let costsForWhite = 0;
                for (let i = 0; i < houseIndex; i++) {
                    costsForWhite += calculateCost(test.houses[i], "W");
                }

                let costsForBlack = 0;
                for (let i = houseIndex; i < test.houses.length; i++) {
                    costsForBlack += calculateCost(test.houses[i], "Z");
                }

                let totalCost = costsForWhite + costsForBlack;
                if (totalCost == 0) {
                    lowestCost = totalCost;
                    break;
                } 
                lowestCost = Math.min(totalCost,lowestCost);
            }
            console.log(`${testIndex + 1} ${lowestCost}`);
        }
    });
});