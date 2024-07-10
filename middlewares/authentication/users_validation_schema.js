const Joi = require("joi");

const registerSchema = Joi.object().keys({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().min(10).required(),
  username: Joi.string().required(),
  mobile: Joi.number().min(10).required(),
  role: Joi.string(),
  address: Joi.string(),

  password: Joi.string()
    .min(5)
    .max(100)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  // password: Joi.string().alphanum().min(5).max(100).required(),
  // repeat_password: Joi.ref("password"),
  // address: Joi.string().required(),
  // isBlocked: Joi.boolean().default("false").required(),
  // cart: Joi.array().required(),
});

const loginSchema = Joi.object().keys({
  email: Joi.string().email().min(10).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

const updateResetPasswordSchema = Joi.object().keys({
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

const forgotPasswordToken = Joi.object().keys({
  email: Joi.string().email().min(10).required(),
});

const changePasswordSchema = Joi.object().keys({
  oldPassword: Joi.string().alphanum().min(5).max(100).required(),
  newPassword: Joi.string().alphanum().min(5).max(100).required(),
  confirmPassword: Joi.string().alphanum().min(5).max(100).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateResetPasswordSchema,
  forgotPasswordToken,
  changePasswordSchema,
};
