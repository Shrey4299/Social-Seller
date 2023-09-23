const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const OrderVariant = sequelize.define("OrderVariant", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return OrderVariant;
};
