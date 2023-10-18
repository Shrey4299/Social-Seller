const Joi = require("joi");

module.exports = {
  createDiscountValidation(req, res, next) {
    const schema = Joi.object({
      name: Joi.string().required(),
      validity: Joi.date().iso(),
      discountPercentage: Joi.number().integer().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    next();
  },
};
