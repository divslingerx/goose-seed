const fs = require("fs-extra")

const writeSeedToFile = (data, name) => {
  const filePath = `src/mocks/${name}`

  fs.ensureDir("src/mocks", err => {
    console.log(err)
  })

  fs.writeJSON(filePath, data, { spaces: 4 }, err => {
    console.log(`${err} saving file to ${filePath}`)
  })
}

module.exports = writeSeedToFile
