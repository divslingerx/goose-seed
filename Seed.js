const createSeedSchema = (model) => {

  const res = {}; /* Final return element */

  const generateSchemaObj = (path, name, schema, context) => {
    /* Generate definition for a single path */
    const result = {
      type: path.instance,
      required: !!path.isRequired,
      validators: path.validators,
      default: path.defaultValue,
      isEnum: Array.isArray(path.enumValues) && path.enumValues.length,
      enumOptions: path.enumValues,
      isPathDef: true,
      lowercase: !!path.options.lowercase,
      uppercase: !!path.options.uppercase,
      trim: !!path.options.trim,
    };

    // get validators
    if (Array.isArray(path.validators)) {
      path.validators.forEach((val) => {
        if (val.type === 'max') {
          result.max = val.max;
        }
        if (val.type === 'min') {
          result.min = val.min;
        }
      });
    }

    // Recurse the function for array element definitions
    if (path.instance.toLowerCase() === 'array') {
      result.isArray = true;
      if (!path.schema) {
        result.arrayDefinition = generateSchemaObj(path.caster);
      } else {
        result.arrayDefinition = createSeedSchema(path.schema);
      }
    }




    if (path.instance.toLowerCase() === 'objectid' && path.options.ref) {
      /* Add referenced object */
      result.ref = path.options.ref.toLowerCase();
    }
    return result;
  };

  const fill = (name, schema, context) => {

    // Extract definition object from schema and path name 
    const path = schema.path(name);

    if (path) {
      context[name] = generateSchemaObj(path, name, schema, context);

      return context;

    }
  };

  // Loop over paths and extract definitions
  if (model.schema) {
    model.schema.eachPath((path) => {
      fill(path, model.schema, res);
    });
  } else {
    model.eachPath((path) => {
      fill(path, model, res);
    });
  }


  return res;
}

class Seed {
  constructor (model, opts, idPools) {
    this.name = model.modelName.toLowerCase()

    this.schema = createSeedSchema(model);
    this.idPools = idPools
    this.opts = opts
    //remove ignored fields
    for (let key in this.schema) {
      if (this.opts.ignore.includes(key)) {
        delete this.schema[key]
      }
    }
  }
}



module.exports = Seed;
