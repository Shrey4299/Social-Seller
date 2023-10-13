const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Discount = sequelize.define("Discount", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    validity: {
      type: DataTypes.DATEONLY,
    },
    discountPercentage: {
      type: DataTypes.INTEGER,
    },
  });

  return Discount;
};
