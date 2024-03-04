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

function printOutput(testIndex, goodSubstrings, ondergrens) {
    // find good substrings that satisfy ondergrens limit
    let printableStrings = [];
    for (const [key, value] of Object.entries(goodSubstrings)) {
        if (value >= ondergrens && key != "") printableStrings.push(key);
    }
    printableStrings.sort();
    let printString = "";
    printableStrings.forEach((str) => (printString += str + " "));

    if (printString == "") printString = "ONMOGELIJK";
    console.log(`${testIndex + 1} ${printString.trimEnd()}`);
}

process.on("exit", () => {

    allTestsObj.forEach((test, testIndex) => {

        let currentTestString = test.texts[0];
        let subStringLength = currentTestString.length;

        let validSubstringFound = false;

        let ceiling = 0

        // check for substring length
        for (let j = 0; j <= subStringLength;) {

            if (testIndex == 11 && subStringLength == 4) {
                console.log();
            }
            let allPatterns = {};

            // find all substrings of this length in all texts (per text)
            test.texts.forEach((text) => {

                // get substrings
                let patternsInThisText = new Set();

                for (let i = 0; i + subStringLength <= text.length; i++) {

                    let substr = text.substr(i, subStringLength);
                    patternsInThisText.add(substr);
                }

                patternsInThisText.forEach((pattern) => {

                    if (allPatterns[pattern] == undefined) {
                        allPatterns[pattern] = 1;
                    }
                    else {
                        allPatterns[pattern]++;

                        if (allPatterns[pattern] >= test.ondergrens) {

                            if (ceiling < allPatterns[pattern]) {
                                ceiling = allPatterns[pattern];
                            }

                            j = subStringLength + 3; // to break on next substringlength
                            validSubstringFound = true;
                        }
                    }

                })


            });

            // PRINT HERE
            // if valid substring (ondergrens approved) has been found
            // stop searching

            if (validSubstringFound || subStringLength == 0) {
                if (subStringLength == 0) {
                    console.log(testIndex + 1 + " ONMOGELIJK");
                }
                else {
                    printOutput(testIndex, allPatterns, test.ondergrens);
                    j = subStringLength + 3; //to break
                }
            }

            subStringLength--;
        }
    });
});