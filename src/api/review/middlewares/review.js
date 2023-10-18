const Joi = require("joi");

module.exports = {
  createReviewValidation(req, res, next) {
    const schema = Joi.object({
      description: Joi.string().required(),
      rating: Joi.number().integer().min(1).max(5).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    next();
  },
};
