const ll = require("lazylines");

process.stdin.resume();

let testsAmount = 0;
let lineNumbersAmount = 0;
let outputText = [];

new ll.LineReadStream(process.stdin).on("line", (line = ll.chomp(l)) => {
  if (testsAmount == 0) {
    testsAmount = +line.replace("\n", "").replace("\r", "");
  } else {
    numbersArray = line
      .replace("\n", "")
      .replace("\r", "")
      .split(" ")
      .map((x) => +x);

    lineNumbersAmount = numbersArray[0];

    let sameCheck = true;
    for (let i = 2; i < lineNumbersAmount; i++) {
      if (numbersArray[i] != numbersArray[i + 1]) {
        sameCheck = false;
      }
    }

    let diff = numbersArray[2] - numbersArray[1];

    if (sameCheck) {
      if (numbersArray[2] == 0) {
        outputText.push(`meetkundig met stap ${0}: ${numbersArray[2]}`);
      } else {
        outputText.push(`meetkundig met stap ${1}: ${numbersArray[2]}`);
      }
    } else if (
      numbersArray[3] - numbersArray[2] == diff &&
      sameCheck == false
    ) {
      outputText.push(
        `rekenkundig met stap ${diff}: ${
          numbersArray[numbersArray.length - 1] + diff
        }`
      );
    } else if (
      numbersArray[2] / numbersArray[1] ==
      numbersArray[3] / numbersArray[2]
    ) {
      outputText.push(
        `meetkundig met stap ${numbersArray[3] / numbersArray[2]}: ${
          numbersArray[numbersArray.length - 1] *
          (numbersArray[3] / numbersArray[2])
        }`
      );
    } else {
      outputText.push("geen van beide");
    }

    testsAmount--;

    if (testsAmount == 0) {
      process.exit();
    }
  }
});

process.on("exit", () => {
  outputText.forEach((output, i) => {
    console.log(`${i + 1} ${output}`);
  });
});