const mongoose = require("mongoose")
const fakeField = require("./fakeField")
const random = require("./funcs/random")
const writeSeedToFile = require("./funcs/writeSeedToFile")
const faker = require("faker")
const Seed = require("./Seed")
const unflatten = require("flat").unflatten

const createIdPool = (modelOpts, globalCount) => {
  let res = []
  let max = modelOpts.count || globalCount
  while (max) {
    res.push(mongoose.Types.ObjectId().toString())
    max--
  }

  return res
};

const createSeedOpts = (modelOpts, globalOpts) => {
  const res = {}
  const { ignore = [], force = {}, count } = modelOpts
  const {
    ignore: gIgnore = [],
    force: gForce = {},
    count: gCount = 25
  } = globalOpts

  //local opts > global opts
  res.force = Object.assign(gForce, force)
  res.ignore = [...gIgnore, ...ignore]
  res.count = count || gCount
  return res
};

const createMocks = seed => {
  let mocks = []

  //fill fields
  const buildMock = (seed, iterNum) => {
    let mock = {}

    //fill fields
    Object.keys(seed.schema).forEach(field => {
      const fieldProps = seed.schema[field]
      const { isEnum, enumOptions, arrayDefinition } = fieldProps
      const type = fieldProps.type
      const isForced = seed.opts.force[field] && true

      const handleFieldTypes = type => {
        let res
        switch (type) {
        case "String" || "Number":
          res = fakeField(field)
            break;
        case "Boolean":
          res = random.boolean()
            break;
        case "Date":
          res = Date.now()
            break;
        case "Buffer":
          res = faker.image.dataUri(200, 200)
          case "Mixed": {
          const arr = ["string", "number", "date", "buffer"]
            res = handleFieldTypes(random.index(arr))
            break;
        }
        default:
          res = false
        }
        return res
      };

      //forced fields
      if (isForced) {
        mock[field] = seed.opts.force[field]
      } else if (isEnum) {
        mock[field] = random.index[enumOptions]
      } else if (type === "Array") {
        let temp = []

        //array of anything but objectId
        if (arrayDefinition.type !== "ObjectID") {
          for (let i = 0; i < 5; i++) {
            temp.push(handleFieldTypes(arrayDefinition.type))
          }
        }

        if (arrayDefinition.type === "ObjectID") {
          const modelRef = arrayDefinition.ref
          const modelRefIds = seed.idPools[modelRef]
          const seedIds = seed.idPools[seed.name]
          const sliceAmount = Math.floor(modelRefIds.length / seedIds.length)
          temp = modelRefIds.slice(iterNum, sliceAmount)
        }
        mock[field] = temp
      } else if (type === "ObjectID") {
        if (fieldProps.ref) {
          mock[field] = seed.idPools[fieldProps.ref][iterNum - 1]
        }
        if (field === "_id") {
          mock[field] = seed.idPools[seed.name][iterNum]
        }
      } else {
        mock[field] = handleFieldTypes(type)
      }
    })

    return mock
  };

  for (let i = 0; mocks.length < seed.opts.count; i++) {
    mocks.push(buildMock(seed, i))
  }

  return mocks
};

const seedDB = ({ models: modelConfigs, opts }) => {
  let idPools = {}
  let seeds = []
  let mocks = {}

  modelConfigs.forEach(config => {
    const [model, modelOpts] = config
    const seedOpts = createSeedOpts(modelOpts, opts.global)
    const idPool = createIdPool(seedOpts)
    idPools[model.modelName.toLowerCase()] = idPool
    const seed = new Seed(model, seedOpts, idPools)
    seeds.push(seed)

    writeSeedToFile(seed.schema, `${seed.name}-schema`)
  })

  seeds.forEach(seed => {
    const seedMocks = createMocks(seed)

    mocks[seed.name] = seedMocks
    writeSeedToFile(unflatten(seedMocks), `${seed.name}-mocks`)
    // writeSeedToFile(seed.schema, `${seed.name}-schema`)
  })

  return mocks
};

module.exports = seedDB
