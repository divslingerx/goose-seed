const fs = require('fs')

const random = {
  number: (min = 0, max = 100) => Math.floor(Math.random() * (max - min + 1) + min),
  index: arr => arr[Math.floor(Math.random() * arr.length)],
  boolean: () => Math.random() > 0.5,
};

const toJson = (data, spacing = 4) => JSON.stringify(data, null, spacing)

const writeObjToFile = (data, name) => {
  const filePath = `${__dirname}/mocks/${name}.json`

  fs.writeFile(filePath, toJson(data), 'utf8', (err) => {
    if (err) { console.log(err) }
    console.log(`saving file to ${filePath}`);
  });
}

module.exports = {
  random,
  writeObjToFile,
  toJson
}

