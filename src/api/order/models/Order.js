const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Order = sequelize.define("Order", {
    price: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "new",
        "accepted",
        "pending",
        "delivered",
        "cancelled"
      ),
    },
    payment: {
      type: DataTypes.ENUM("COD", "prepaid"),
    },
    address: {
      type: DataTypes.STRING,
    },
    slug: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    razorpayId: {
      type: DataTypes.STRING,
    },
    razorpayOrderId: {
      type: DataTypes.STRING,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
    },
  });

  return Order;
};
