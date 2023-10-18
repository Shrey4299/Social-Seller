const Joi = require("joi");

const userCreateSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must have at least 8 characters with at least one lowercase letter, one uppercase letter, one digit, and one special character.",
    }),
  phoneNumber: Joi.string()
    .pattern(new RegExp("^[0-9]{10}$"))
    .required()
    .messages({
      "string.pattern.base": "Phone number must be a 10-digit number.",
    }),
});

const userUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .messages({
      "string.pattern.base":
        "Password must have at least 8 characters with at least one lowercase letter, one uppercase letter, one digit, and one special character.",
    }),
  phoneNumber: Joi.string().pattern(new RegExp("^[0-9]{10}$")).messages({
    "string.pattern.base": "Phone number must be a 10-digit number.",
  }),
});

const userPasswordSchema = Joi.object({
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must have at least 8 characters with at least one lowercase letter, one uppercase letter, one digit, and one special character.",
    }),

  confirmPassword: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must have at least 8 characters with at least one lowercase letter, one uppercase letter, one digit, and one special character.",
    }),
});

const validateUserCreate = (req, res, next) => {
  const { error } = userCreateSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      message: error.details[0].message,
    });
  }

  next();
};

const validateUserUpdate = (req, res, next) => {
  const { error } = userUpdateSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      message: error.details[0].message,
    });
  }

  next();
};

const validatePassword = (req, res, next) => {
  const { error } = userPasswordSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = { validateUserCreate, validateUserUpdate, validatePassword };
