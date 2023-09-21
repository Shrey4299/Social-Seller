const db = require("../models");
const Order = db.orders;
const Product = db.products;
const Discount = db.discounts;

exports.create = async (req, res) => {
  try {
    const { quantity, UserId, status, payment, ProductId, couponCode } =
      req.body;

    if (!quantity || !UserId || !ProductId) {
      return res.status(400).send({
        message: "Quantity, UserId, and ProductId are required fields!",
      });
    }

    const product = await Product.findOne({
      where: {
        id: ProductId,
      },
    });

    const discount = await Discount.findOne({
      where: {
        name: couponCode,
      },
    });

    console.log(discount.discountPercentage);

    if (discount) {
      var finalPrize =
        product.price * quantity -
        (product.price * quantity) / discount.discountPercentage;
    } else {
      var finalPrize = product.price * quantity;
    }

    if (!product) {
      return res.status(404).send({
        message: "Product not found",
      });
    }

    const order = {
      quantity: quantity,
      price: finalPrize,
      UserId: UserId,
      status: status,
      payment: payment,
      ProductId: ProductId,
    };

    const createdOrder = await Order.create(order);

    res.status(201).send(createdOrder);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Order.",
    });
  }
};

exports.findAll = (req, res) => {
  Order.findAll({ include: [{ model: db.products }] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving orders.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Order.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Order with id=${id} was not found.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Order with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Order.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Order was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Order with id=${id}. Maybe Order was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Order with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Order.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Order was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Order with id=${id}. Maybe Order was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Order with id=" + id,
      });
    });
};
