const ll = require("lazylines");

process.stdin.resume();
const input = new ll.LineReadStream(process.stdin);

let testsAmount = 0;
let ondergrens = -1;
let numberOfTexts = -1;
let textArray = [];
let allTestsObj = [];

input.on("line", (l) => {
  let line = ll.chomp(l);

  if (testsAmount == 0) {
    testsAmount = +line;
  } else if (ondergrens == -1) {
    ondergrens = +line;
  } else if (numberOfTexts == -1) {
    numberOfTexts = +line;
  } else {
    textArray.push(line);
    if (textArray.length == numberOfTexts) {
      textArray.sort((a, b) => {
        return b.length - a.length;
      });
      allTestsObj.push({
        ondergrens: ondergrens,
        texts: textArray,
      });
      ondergrens = -1;
      textArray = [];
      numberOfTexts = -1;
      testsAmount--;
    }
  }

  if (testsAmount == 0) {
    process.exit();
  }
});

function printOutput(test, testIndex, goodSubstrings) {
  // find good substrings that satisfy ondergrens limit
  let printableStrings = [];
  for (const [key, value] of Object.entries(goodSubstrings)) {
    if (value >= test.ondergrens && key != "") printableStrings.push(key);
  }
  printableStrings.sort();
  let printString = "";
  printableStrings.forEach((str) => (printString += str + " "));

  if (printString == "") printString = "ONMOGELIJK";
  console.log(`${testIndex + 1} ${printString.trimEnd()}`);
}

process.on("exit", () => {
  allTestsObj.forEach((test, testIndex) => {
    if (testIndex == 4) {
      console.log();
    }

    let subStrings = [];
    let goodSubstrings = {};

    let currentTestString = test.texts[0];
    let subStringLength = currentTestString.length;

    let validSubstringFound = false;
    let validSubstringFoundTextIndex = -1;
    let searching = true;

    // check for substring length
    for (let j = 0; j < subStringLength && searching; j--) {

      // find all substrings of this length in all texts
      test.texts.forEach((text, textIndex) => {

        // get substrings
        for (let i = 0; i + subStringLength <= text.length; i++) {
          if (!subStrings.includes(text.substr(i, subStringLength))) {
            subStrings.push(text.substr(i, subStringLength));
          }
        }

        // loop through all texts and compare substrings in other texts
        for (let i = 0; i < test.texts.length; i++) {
          if (!searching) break; // NECESSARY
          subStrings.forEach((string) => {
            // if string includes substring
            if (test.texts[i].includes(string)) {
              // if string is not yet part of Good Substrings, then initialize
              if (goodSubstrings[string] == undefined) {
                goodSubstrings[string] = 0;
              }

              // add count for this substring
              goodSubstrings[string]++;

              // if this substring has been found enough times for ondergrens
              // then a valid substring has been found

              if (goodSubstrings[string] >= test.ondergrens)
                validSubstringFound = true;
            }
          });
        } // end of text looping

        if (validSubstringFound) {
          searching = false;
        }

        // PRINT HERE
        // if valid substring (ondergrens approved) has been found
        // stop searching
        if (!searching) {
          if (textIndex == 0) printOutput(test, testIndex, goodSubstrings);
        }

        // reset substrings
        goodSubstrings = {};
        subStrings = [];
      });

      subStringLength--;
    }
  });
});