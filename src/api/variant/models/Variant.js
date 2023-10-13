const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Variant = sequelize.define("Variant", {
    color: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    size: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
  });

  return Variant;
};
