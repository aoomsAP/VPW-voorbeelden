const ll = require("lazylines");

process.stdin.resume();
const input = new ll.LineReadStream(process.stdin);

let numLists = 0;
let listLength = 0;
let listIndex = -1;
let lists = [];

input.on("line", line => {
    let n = ll.chomp(line); // line with number

    // first line
    if (numLists == 0) {
        numLists = +n;
    }
    else {
        // new list
        if (numLists > 0 && listLength == 0) {
            listIndex++;
            listLength = +n;
        }
        // fill list
        else {
            if (!lists[listIndex]) lists[listIndex] = []; // initialize list
            lists[listIndex].push(+n);
            listLength--;
        }
    }

    // new line after all input has been pasted in terminal
    if (n === "") process.exit();
})

process.on("exit", function () {
    // output
    lists.forEach((list, i) => {
        console.log(`${i + 1} ${Math.min(...list)} ${Math.max(...list)}`);
    })
});