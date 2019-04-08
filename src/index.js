const seedDB = require("./Seeder")
const User = require("../models/User")
const Post = require("../models/Post")
const Comment = require("../models/Comment")

const config = {
  models: [
    [
      User,
      {
        force: { password: "password123" },
        count: 20
      }
    ],

    [Post, { count: 10 }],
    [Comment, { count: 30 }]
  ],
  opts: {
    global: {
      //model opts will always overwrite global opts
      ignore: ["__v", "createdAt", "updatedAt"], // ignore these fields globally
      force: { password: "password123" }, // force these fields globally
      count: 5 // default count
    },
    folderPath: `${__dirname}/seeds/`, // Path to folder to save seed files
    dropCollections: ["users"] // Drop collections from DB
  }
}

seedDB(config)
