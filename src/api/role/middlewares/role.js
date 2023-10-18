const Joi = require("joi");

module.exports = {
  createRoleValidation(req, res, next) {
    const schema = Joi.object({
      title: Joi.string().valid("admin", "authenticated", "user").required(),
      description: Joi.string(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    next();
  },
};
