const db = require("../models");

const checkVariantQuantity = async (req, res, next) => {
  try {
    const { VariantId, quantity } = req.body;

    const variant = await db.variants.findOne({
      where: { id: VariantId },
    });

    console.log(variant.quantity);

    if (!variant || variant.quantity < quantity) {
      return res.status(400).send({
        message: "Variant quantity is insufficient.",
      });
    }

    if (quantity <= 0) {
      return res.status(400).send({
        message: "Requested quantity must be greater than 0.",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

module.exports = checkVariantQuantity;
