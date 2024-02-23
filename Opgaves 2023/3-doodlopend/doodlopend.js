// given that we will need to traverse a graph/vertex
// to identify dead ends
// we will first transform the data into a graph
// and then traverse the graph

// example of graph:
// -----------------
// const graph = {
//     A: ['B', 'D'],
//     B: ['A', 'C', 'E'],
//     C: ['B'],
//     D: ['A', 'E'],
//     E: ['B', 'D', 'F'],
//     F: ['E'],
//   };

const ll = require('lazylines');

process.stdin.resume();
const input = new ll.LineReadStream(process.stdin);

let testsAmount = 0;
let streetsAmount = null; // 1-999
let streets = []; // 1-100
let allNodes = [];
let tests = [];

input.on('line', (l) => {
    let line = ll.chomp(l);

    if (testsAmount == 0) {
        testsAmount = +line;
    }
    else {
        if (streetsAmount == null) {
            streetsAmount = +line;
        }
        else {
            let street = line.split(" ").map(x => +x);
            streets.push(street);

            // collect all nodes in one array
            allNodes = [...allNodes, ...street];

            // when all streets have been collected =>
            if (streets.length === streetsAmount) {

                // MAKING A GRAPH FROM THIS DATA
                // ------------------------------

                // get all unique nodes
                let uniqueIntersections = [...new Set(allNodes)];

                let graph = {};
                uniqueIntersections.forEach(intersection => {
                    // find the connecting node of each intersection
                    let connectedNodes = []
                    streets.forEach(street => {
                        if (street[0] === intersection) connectedNodes.push(street[1]);
                        if (street[1] === intersection) connectedNodes.push(street[0]);
                    })

                    // add to graph with intersection as key
                    // and connected nodes as values
                    graph[intersection] = connectedNodes;
                })

                // push test
                tests.push({
                    streetsAmount: streetsAmount,
                    streets: streets,
                    graph: graph,
                })

                // go to next test & reset variables
                testsAmount--;
                streetsAmount = null;
                streets = [];
                allNodes = [];
            }
        }
    }

    if (testsAmount == 0) process.exit();
});

let signs = [];

// logic to implement
// a street needs NO SIGN
// when its destination node
// can lead us back to our starting point
// without hitting a dead end
// (aka a node with just ONE edge)

// approach: BFS, DFS?
// shortest path algorithm?

process.on('exit', () => {
    tests.forEach((test, i) => {

        let signs = [[1, 2], [1, 3]];

        // if no signs, write "geen"
        if (signs.length < 1) {
            console.log(`${i + 1} ${geen}`);
        }
        // if signs, fetch string that lists all values
        else {
            let signString = signs.reduce((prev, acc, index) => {
                if (index === 0) return `(${acc[0]},${acc[1]})`;
                else return prev + ` (${acc[0]},${acc[1]})`;
            }, "");
            console.log(`${i + 1} ${signString}`);
        }

        console.log(test.graph);
    });
});