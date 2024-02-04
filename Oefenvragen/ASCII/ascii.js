const ll = require("lazylines");

process.stdin.resume();
const input = new ll.LineReadStream(process.stdin);

input.on("line", (n) => {
    let figure = "";

    let spacesFront = 2 * n; // pattern: diminsh by 2, per two
    let spacesBetween = 1; // pattern: add 4, per two

    let one = "*";
    let three = "***";

    // edge
    figure+= " ".repeat(spacesFront) + three + "\n\n";

    // top
    for (let i = 0; i < n; i++) {
        figure+= " ".repeat(spacesFront) + one + " ".repeat(spacesBetween) + one + "\n\n";
        spacesFront-=2;

        figure+= " ".repeat(spacesFront) + three + " ".repeat(spacesBetween) + three + "\n\n";
        spacesBetween +=4;
    }

    // middle
    figure+= " ".repeat(spacesFront) + one + " ".repeat(spacesBetween) + one + "\n\n";

    // bottom
    for (let i = 0; i < n; i++) {
        spacesBetween -=4;
        figure+= " ".repeat(spacesFront) + three + " ".repeat(spacesBetween) + three + "\n\n";

        spacesFront+=2;
        figure+= " ".repeat(spacesFront) + one + " ".repeat(spacesBetween) + one + "\n\n";
    }

    // edge
    figure+= " ".repeat(spacesFront) + three + "\n\n";

    // print figure
    process.stdout.write(figure);
});