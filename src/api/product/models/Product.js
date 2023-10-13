const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  // console.log(sequelize);
  const Product = sequelize.define("Product", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
    },
  });

  return Product;
};
