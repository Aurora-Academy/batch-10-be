const Joi = require("joi");

const Schema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com"] },
    })
    .required(),
  password: Joi.string().optional(),
});

const FPSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com"] },
    })
    .required(),
  newPassword: Joi.string().required(),
  token: Joi.string().min(6).max(6).required(),
});

const validate = async (req, res, next) => {
  try {
    await Schema.validateAsync(req.body);
    next();
  } catch (e) {
    const { details } = e;
    next(details[0]?.message);
  }
};

const forgetPasswordValidation = async (req, res, next) => {
  try {
    await FPSchema.validateAsync(req.body);
    next();
  } catch (e) {
    const { details } = e;
    next(details[0]?.message);
  }
};

module.exports = { validate, forgetPasswordValidation };
