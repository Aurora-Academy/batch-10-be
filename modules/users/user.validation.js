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

const validate = async (req, res, next) => {
  try {
    await Schema.validateAsync(req.body);
    next();
  } catch (e) {
    const { details } = e;
    next(details[0]?.message);
  }
};

module.exports = { validate };
