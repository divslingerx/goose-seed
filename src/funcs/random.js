const random = {
  number: (min = 0, max = 100) =>
    Math.floor(Math.random() * (max - min + 1) + min),
  index: arr => arr[Math.floor(Math.random() * arr.length)],
  boolean: () => Math.random() > 0.5
}
module.exports = random
