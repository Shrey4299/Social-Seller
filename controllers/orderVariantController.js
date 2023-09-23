const db = require("../models");
const OrderVariant = db.ordervariants;

exports.create = async (req, res) => {
  const { quantity, price, OrderId, VariantId } = req.body;

  try {
    const orderVariant = await OrderVariant.create({
      quantity: quantity,
      price: price,
      OrderId: OrderId,
      VariantId: VariantId,
    });

    res.status(201).send(orderVariant);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
