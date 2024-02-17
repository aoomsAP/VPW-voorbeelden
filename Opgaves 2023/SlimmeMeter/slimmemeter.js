const ll = require("lazylines");

process.stdin.resume();
const input = new ll.LineReadStream(process.stdin);

let numberOfTests = 0;
let testIndex = 0;
let costOfElectricity = [];
let numberOfTasks = 0;
let task;
let minimalTotalCosts = [];

function calculateCost(hours,minutes,startHourIndex,costOfElectricity,usage) {
    let total = 0;
    if (minutes == 0) {
        for (let i = 0; i < hours; i++) {
            total += usage * (costOfElectricity[startHourIndex + i] * 60);
        }
    }
    else {
        if (costOfElectricity[startHourIndex] > costOfElectricity[startHourIndex + hours]) {
            let i = 0;
            total += usage * (costOfElectricity[startHourIndex] * minutes);
            for (i = 0; i < hours; i++) {
                total += usage * (costOfElectricity[startHourIndex + i + 1] * 60);
            }
        }
        else {
            let i = 0;
            for (i = 0; i < hours; i++) {
                total += usage * (costOfElectricity[startHourIndex + i] * 60);
            }
            total += usage * (costOfElectricity[startHourIndex + i] * minutes);
        }
    }
    return total;
}

input.on("line", line => {
    const inputLine = ll.chomp(line);

    if (numberOfTests == 0) {
        numberOfTests = +inputLine;
    }
    else {
        if (costOfElectricity.length == 0) {
            costOfElectricity = inputLine.split(" ").map(x => +x);
        }
        else if (numberOfTasks == 0) {
            numberOfTasks = +inputLine;
            minimalTotalCosts[testIndex] = 0;
        }
        else {
            task = inputLine.split(" ").map(x => +x);
            let usage = task[0];
            let durationInMinutes = task[1];

            let hours = Math.floor(durationInMinutes / 60);
            let minutes = durationInMinutes - (hours * 60);

            // calculate cost at every index
            let estimations = [];
            for (let index = 0; index < costOfElectricity.length; index++) {
                let estimate = calculateCost(hours,minutes,index,costOfElectricity,usage);
                estimations.push({ estimate: estimate, hourIndex: index });
            }
            estimations.sort((a, b) => a.estimate - b.estimate);

            minimalTotalCosts[testIndex] += estimations[0].estimate;

            numberOfTasks--;
            if (numberOfTasks == 0) {
                numberOfTests--;
                testIndex++;
                costOfElectricity = [];
            }
        }
    }

    if (numberOfTests == 0) {
        process.exit();
    }
})

process.on("exit", () => {
    minimalTotalCosts.forEach((min, i) => {
        console.log(`${i + 1} ${min}`);
    })
})