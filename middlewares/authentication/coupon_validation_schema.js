const Joi = require("joi");

const couponSchema = Joi.object().keys({
  name: Joi.string().required(),
  expiry: Joi.date().required(),
  discount: Joi.number().min(10).required(),
});

module.exports = {
  couponSchema,
};
