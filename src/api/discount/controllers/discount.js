const db = require("../../../services");
const Discount = db.discounts;

exports.create = async (req, res) => {
  try {
    const { name, validity, discountPercentage } = req.body;

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
