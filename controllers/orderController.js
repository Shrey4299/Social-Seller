const db = require("../models");
const Order = db.orders;
const Discount = db.discounts;
const Address = db.address;
const OrderVariant = db.ordervariants;

exports.create = async (req, res) => {
  try {
    const { payment, couponCode } = req.body;
    const UserId = req.user.id;

    if (!UserId || !payment) {
      return res.status(400).send({
        message: "user and payment method are required fields!",
      });
    }

    const discount = await Discount.findOne({
      where: {
        name: couponCode,
      },
    });

    console.log(discount.discountPercentage);

    if (discount) {
      var finalPrize = -10;
    } else {
      var finalPrize = 0;
    }

    const address = await Address.findOne({
      where: {
        UserId: UserId,
      },
    });

    const order = {
      price: finalPrize,
      UserId: UserId,
      payment: payment,
      status: "new",
      address: address.id,
      isPaid: "false",
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
  Order.findAll()
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

exports.createVariantOrder = async (req, res) => {
  const { quantity, VariantId } = req.body;

  try {
    const variant = await db.variants.findOne({
      where: {
        id: VariantId,
      },
    });

    const UserId = req.user.id;

    // Find all cart variants associated with the user
    const order = await Order.findOne({
      where: { UserId: UserId },
    });

    const orderVariant = await OrderVariant.create({
      quantity: quantity,
      price: variant.price,
      OrderId: order.id,
      VariantId: VariantId,
    });

    // Add the price to the existing price in the associated Order
    const newPrice = order.price + quantity * variant.price;

    // Update the price field in the associated Order
    await order.update({ price: newPrice });

    res.status(201).send(orderVariant);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
