const db = require("../models");
const Cart = db.carts;

exports.create = async (req, res) => {
  try {
    const { totalPrice } = req.body;

    const cart = await Cart.create({
      totalPrice,
    });

    res.status(201).send(cart);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error occurred while creating the Cart.",
    });
  }
};
