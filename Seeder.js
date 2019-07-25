const mongoose = require('mongoose');
const fakeField = require('./fakeField');
const { random, writeObjToFile } = require("./funcs");
const faker = require("faker")
const Seed = require("./Seed")
const unflatten = require('flat').unflatten


const createIdPool = (modelOpts, globalCount) => {
  let res = []
  let max = modelOpts.count || globalCount
  while (max) {
    res.push(mongoose.Types.ObjectId().toString())
    max--
  }

  return res
}

//create the default options for seeds
const createSeedOpts = (modelOpts, globalOpts) => {
  const res = {};
  const { ignore = [], force = {}, count } = modelOpts;
  const { ignore: gIgnore = [], force: gForce = {}, count: gCount = 25 } = globalOpts;

  //local opts > global opts
  res.force = Object.assign(gForce, force);
  res.ignore = [...gIgnore, ...ignore];
  res.count = count || gCount;
  return res;
}

const createMocks = (seed) => {

  let mocks = []



  //fill fields
  const buildMock = (seed, iterNum) => {
    let mock = {}


    //fill fields
    Object.keys(seed.schema).forEach((field) => {
      const fieldProps = seed.schema[field];
      const { isEnum, enumOptions, arrayDefinition } = fieldProps;
      const type = fieldProps.type;
      const isForced = seed.opts.force[field] && true

      const handleFieldTypes = (type) => {
        let res;
        switch (type) {
          case "String" || "Number": res = fakeField(field); break;
          case "Boolean": res = random.boolean(); break;
          case "Date": res = Date.now(); break;
          case "Buffer": res = faker.image.dataUri(200, 200)
          case "Mixed": {
            const arr = ["string", "number", "date", "buffer"]
            res = handleFieldTypes(random.index(arr))
          }
          default: res = false;
        }
        return res
      }

      //forced fields
      if (isForced) {
        mock[field] = seed.opts.force[field];
      }

      else if (isEnum) {
        //get enum value at random index
        mock[field] = random.index[enumOptions]
      }

      else if (type === "Array") {
        let temp = []

        //array of anything but objectId
        if (arrayDefinition.type !== "ObjectID") {

          for (let i = 0; i < 5; i++) {
            temp.push(handleFieldTypes(arrayDefinition.type))
          }
        }

        //array of ObjectIds
        if (arrayDefinition.type === "ObjectID") {
          const modelRef = arrayDefinition.ref
          const modelRefIds = seed.idPools[modelRef]
          const seedIds = seed.idPools[seed.name]
          const sliceAmount = Math.floor(modelRefIds.length / seedIds.length)
          temp = modelRefIds.slice(iterNum, sliceAmount)
        }
        mock[field] = temp
      }

      else if (type === "ObjectID") {
        if (fieldProps.ref) { mock[field] = seed.idPools[fieldProps.ref][iterNum - 1] }
        if (field === "_id") {
          mock[field] = seed.idPools[seed.name][iterNum]
        }
      }


      else {
        mock[field] = handleFieldTypes(type)
      }


    });


    return mock
  }



  for (let i = 0; mocks.length < seed.opts.count; i++) {
    mocks.push(buildMock(seed, i))
  }


  return mocks
}


// the main function

const seedDB = ({ models: modelConfigs, options }) => {
  //id pools to be used for all models.
  let idPools = {}
  let seeds = []
  let mocks = {}



  modelConfigs.forEach(modelConfig => {
    const [model, modelOpts] = modelConfig;
    //combine local and global options
    const seedOpts = createSeedOpts(modelOpts, options.global);
    //create ID pool for model
    const idPool = createIdPool(seedOpts);
    idPools[model.modelName.toLowerCase()] = idPool;
    const seed = new Seed(model, seedOpts, idPools);
    seeds.push(seed)
    options.global.writeFiles && writeObjToFile(seed.schema, `${seed.name}-schema`)


  });

  seeds.forEach((seed) => {
    const seedMocks = createMocks(seed)

    mocks[seed.name] = seedMocks
    writeObjToFile(unflatten(seedMocks), `${seed.name}-mocks`)
  })





  return mocks

}


module.exports = seedDB;
