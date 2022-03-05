// get words to json
const words = require('an-array-of-english-words');
const fs = require('fs');
fs.writeFileSync("words.json", JSON.stringify(words, null, 2));