const ll = require('lazylines');

process.stdin.resume();
const input = new ll.LineReadStream(process.stdin);

let testsAmount = 0;
let capacity = null;
let visitors = [];
let tests = [];

input.on('line', (l) => {
    let line = ll.chomp(l);

    if (testsAmount == 0) {
        testsAmount = +line;
    }
    else {
        if (capacity == null) {
            capacity = +line.split(" ")[0];
        }
        else {
            visitors = line.split(" ").map(x => +x);

            tests.push({
                capacity: capacity,
                visitors: visitors,
            })

            capacity = null;
            testsAmount--;
        }
    }

    if (testsAmount == 0) process.exit();
});

function getZone(visitors,capacity) {
    if (visitors <= ((capacity*80)/100)) {
        return "g";
    }
    if (visitors > ((capacity*80)/100) && visitors <= capacity) {
        return "o";
    }
    if (visitors > capacity) {
        return "r";
    }
}

process.on('exit', () => {
    tests.forEach((test, i) => {

        let totalVisitors = 0;
        let zones = "";
        test.visitors.forEach(change => {
            totalVisitors+=change;
            zones+= getZone(totalVisitors,test.capacity)+" "
        })

        console.log(`${i + 1} ${zones.substring(0,zones.length-1)}`);
    });
});