const ll = require('lazylines');

process.stdin.resume();
const input = new ll.LineReadStream(process.stdin);

let testsAmount = 0;
let tripsAmount = 0;
let trips = [];
let tests = [];

input.on('line', (l) => {
    let line = ll.chomp(l);

    if (testsAmount == 0) {
        testsAmount = +line;
    }
    else {
        if (tripsAmount == 0) {
            tripsAmount = +line;
        }
        else {
            trips.push({
                persoonNummer: +line.split(" ")[0],
                startStation: +line.split(" ")[1],
                endStation: +line.split(" ")[2],
            })
            tripsAmount--;

            if (tripsAmount == 0) {
                tests.push(trips);
                trips = [];
                testsAmount--;
            }
        }
    }

    if (testsAmount == 0) process.exit();
});

process.on('exit', () => {
    tests.forEach((test, i) => {
        // write index
        process.stdout.write(`${i + 1} `);

        // get all unique stations
        let allStations = new Set();
        test.forEach(trip => {
            allStations.add(trip.startStation);
            allStations.add(trip.endStation);
        });

        // initialize fake dictionary
        let visitorsPerStation = [];
        allStations.forEach(station => {
            visitorsPerStation.push({
                station: station,
                visitors: new Set(),
            })
        })

        // for each trip, add person to set of visitors
        // this set of people will be unique
        test.forEach(trip => {
            // find the start station in fake dictionary
            // then add trip person to visitors
            visitorsPerStation
                .find(x => x.station == trip.startStation)
                .visitors.add(trip.persoonNummer);

            visitorsPerStation
                .find(x => x.station == trip.endStation)
                .visitors.add(trip.persoonNummer);
        })

        // sort fake dictionary by amount of visitors
        visitorsPerStation.sort((a,b) => {
            let visitorsDiff = [...b.visitors].length-[...a.visitors].length;
            if (visitorsDiff == 0) return a.station-b.station
            else return visitorsDiff;
        })

        // write station(visitorsAmount)
        visitorsPerStation.forEach((station,i) => {
            if (i === 0) process.stdout.write(`${station.station}(${[...station.visitors].length})`)
            else process.stdout.write(` ${station.station}(${[...station.visitors].length})`);
        })

        console.log();
    });
});