const ll = require('lazylines');

process.stdin.resume();

let testsAmount = -1;
let minLimit = -1;
let testTextsAmount = -1;
let testTextIndex = 0;
let testIndex = 0;
let minLimitArray = [];
const texts = [];

new ll.LineReadStream(process.stdin).on('line', (l) => {
    let line = ll.chomp(l);

    if (testsAmount == -1) testsAmount = +line;
    else if(minLimit == -1) {
        minLimit = +line
        minLimitArray.push(minLimit);
        texts[testIndex] = [];
    }
    else if(testTextsAmount == -1) testTextsAmount = +line;
    else{
        if (testTextIndex < testTextsAmount){
            
            texts[testIndex].push(line);
            testTextIndex++;
        } 
        if (testTextIndex >= testTextsAmount){
            testTextIndex = 0;
            minLimit = -1;
            testTextsAmount = -1;
            testIndex++;
        }
        if (testIndex == testsAmount){
            process.exit();
        }
    }
});

function findLongestSubstrings(minLimit, texts) {
    const substringPatternCount = {};

    for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        const substrings = new Set();

        for (let j = 0; j < text.length; j++) {
            for (let k = j + 1; k <= text.length; k++) {
                const substring = text.substring(j, k);
                substrings.add(substring);
            }
        }

        substrings.forEach(substring => {
            if (!substringPatternCount[substring]) {
                substringPatternCount[substring] = 1;
            } else {
                substringPatternCount[substring]++;
            }
        });
    }

    const goodSubstrings = [];
    Object.keys(substringPatternCount).forEach(substring => {
        if (substringPatternCount[substring] >= minLimit) {
            goodSubstrings.push(substring);
        }
    });

    // filter out substrings wiht length less than longest length substring:
    const longestSubstring = Math.max(...goodSubstrings.map(substring => substring.length));
    const reallyGoodSubstrings = goodSubstrings.filter(substring => substring.length === longestSubstring);

    reallyGoodSubstrings.sort();
    let returnString = '';
    if (reallyGoodSubstrings.length> 0){
        returnString = reallyGoodSubstrings.join(" ")
    }
    else{
        returnString = "ONMOGELIJK"
    }
    return returnString;
}

process.on('exit', () => {
    texts.forEach((text, index) => {
        console.log(`${index + 1} ${findLongestSubstrings(minLimitArray[index], text)}`);
    })
});

