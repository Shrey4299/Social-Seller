const Joi = require("joi");

module.exports = {
  async validateVariantCreate(req, res, next) {
    const variantSchema = Joi.object({
      color: Joi.string().required(),
      size: Joi.string().required(),
      quantity: Joi.number().required().integer().positive(),
      price: Joi.number().required().integer().positive(),
      image: Joi.string().optional(),
    });

    const { error } = variantSchema.validate(req.body);

    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    next();
  },

  async validateVariantUpdate(req, res, next) {
    const variantSchema = Joi.object({
      color: Joi.string().optional(),
      size: Joi.string().optional(),
      quantity: Joi.number().optional().integer().positive(),
      price: Joi.number().optional().integer().positive(),
      image: Joi.string().optional(),
    });

    const { error } = variantSchema.validate(req.body);

    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    next();
  },
};
