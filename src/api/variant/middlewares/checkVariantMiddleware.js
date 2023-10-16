// const Joi = require("joi");
const db = require("../../../services");
const Variant = db.variants;
const FormData = require("form-data");
const fs = require("fs");

const checkVariantMiddleware = async (req, res, next) => {
  try {
    let data = new FormData();
    data.append("image", fs.createReadStream("../uploads/1695283878824.jpg"));
    data.append("color", "brown");
    data.append("size", "medium");
    data.append("price", "4500");
    data.append("quantity", "25");
    data.append("ProductId", "1");
    // const schema = Joi.object({
    //   color: Joi.string().required(),
    //   size: Joi.string().required(),
    //   quantity: Joi.number().integer().min(1).required(),
    //   price: Joi.number().positive().required(),
    //   image: Joi.string().optional(),
    // });
    console.log("Request Body");
    console.log(data);
    // const { error, value } = schema.validate(req.body);

    // if (error) {
    //   return res.status(400).send({
    //     message: error.details[0].message,
    //   });
    // }

    // const variant = await Variant.build(value);

    // req.variant = variant;
    // next();
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

module.exports = checkVariantMiddleware;
