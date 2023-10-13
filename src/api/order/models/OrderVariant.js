const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const OrderVariants = sequelize.define("OrderVariants", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return OrderVariants;
};
