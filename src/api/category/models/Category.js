const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  // console.log(sequelize);
  const Category = sequelize.define("Category", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return Category;
};
