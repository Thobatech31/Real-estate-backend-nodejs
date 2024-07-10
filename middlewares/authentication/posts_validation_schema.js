const Joi = require("joi");

const createPostSchema = Joi.object().keys({
  title: Joi.string().required(),
  address: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(10).required(),
  city: Joi.string().required(),
  bedroom: Joi.number().required(),
  bathroom: Joi.number().required(),
  latitude: Joi.string().required(),
  longitude: Joi.string().required(),
  type: Joi.string().required(),
  property: Joi.string().required(),
});

const createPostCategorySchema = Joi.object().keys({
  title: Joi.string().required(),
});

module.exports = {
  createPostSchema,
  createPostCategorySchema,
};
