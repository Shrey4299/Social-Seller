const db = require("../models");
const Discount = db.discounts;

exports.create = (req, res) => {
  const { name, validity, discountPercentage } = req.body;

  // Validate request
  if (!name || !discountPercentage) {
    return res.status(400).send({
      message: "Name  are required fields!",
    });
  }

  Discount.create({
    name: name,
    validity: validity,
    discountPercentage: discountPercentage,
  })
    .then((discount) => {
      res.send(discount);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Discount.",
      });
    });
};
