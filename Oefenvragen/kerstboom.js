const ll = require("lazylines");

process.stdin.resume();
const input = new ll.LineReadStream(process.stdin);

input.on("line", (n) => {
    let layers = 2 + (+n);
    let tree = "";
    let stars = 1;
    let spaces = layers-1;

    // tree layers
    for (let i = layers; i > 0; i--) {
        // create layer
        tree+= " ".repeat(spaces);
        tree+= "*".repeat(stars);
        tree+= "\n";

        // prepare for new layer
        stars+=2;
        spaces--;
    }

    // add stem
    tree+= " ".repeat(layers-1) + "*" + "\n";
    tree+= " ".repeat(layers-1) + "*" + "\n";;

    // print tree
    process.stdout.write(tree);
});