const Joi = require("joi");

module.exports = {
  createAddressValidation(req, res, next) {
    const schema = Joi.object({
      Country: Joi.string().required(),
      State: Joi.string().required(),
      City: Joi.string().required(),
      Pincode: Joi.string().allow(null, "").optional(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    next();
  },

  updateAddressValidation(req, res, next) {
    const schema = Joi.object({
      Country: Joi.string().optional(),
      State: Joi.string().optional(),
      City: Joi.string().optional(),
      Pincode: Joi.string().allow(null, "").optional(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    next();
  },
};
