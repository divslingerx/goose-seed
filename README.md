# Goose-Seed


to use goose-seed all you need to do is create a simple config object

```
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
      // model opts will always overwrite global opts
      ignore: ["__v", "createdAt", "updatedAt"], // ignore these fields globally
     // force these fields on all models globally
      force: { password: "password123" },  
      // default count of seeds
      count: 5
    },
    // Path to folder to save seed files
    folderPath: `${__dirname}/mocks/`, 
    //if collection should be dropped upon save
    dropCollections: ["users"] // Drop collections from DB
  }
}

seedDB(config)
```
