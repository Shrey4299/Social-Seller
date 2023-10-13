const db = require("../models");
const Discount = db.discounts;

exports.create = async (req, res) => {
  try {
    const { name, validity, discountPercentage } = req.body;

    // Validate request
    if (!name || !discountPercentage) {
      return res.status(400).send({
        message: "Name and discountPercentage are required fields!",
      });
    }

    const discount = await Discount.create({
      name: name,
      validity: validity,
      discountPercentage: discountPercentage,
    });

    return res.status(201).send(discount);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Some error occurred while creating the Discount.",
    });
  }
};
