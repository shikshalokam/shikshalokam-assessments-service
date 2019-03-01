const Joi = require('joi');

const parentObject = Joi.object().keys({
    studentName: Joi.string().required(),
    grade: Joi.string().required(),
    name: Joi.string().required(),
    gender: Joi.string().required(),
    type: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
    typeLabel: Joi.string().optional(),
    phone1: Joi.string().required(),
    phone2: Joi.string().valid("").required(),
    address: Joi.string().required(),
    schoolId: Joi.string().required(),
    schoolName: Joi.string().required(),
    programId: Joi.string().required(),
  })
  
module.exports ={
    name: "parentRegistryControlleraddSchema",
    schema: Joi.object().keys({
        parents: Joi.array().items(parentObject)
      })
};