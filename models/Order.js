const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Order = sequelize.define("Order", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    slug: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
  });

  return Order;
};
