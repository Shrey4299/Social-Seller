const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
});

const updateProductSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
});

module.exports = {
  validateCreateProduct(req, res, next) {
    const { error } = createProductSchema.validate(req.body);

    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    next();
  },

  validateUpdateProduct(req, res, next) {
    const { error } = updateProductSchema.validate(req.body);

    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    next();
  },
};
