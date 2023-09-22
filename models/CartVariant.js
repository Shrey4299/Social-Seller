const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const CartVariants = sequelize.define("CartVariants", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return CartVariants;
};
