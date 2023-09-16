const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Tutorial = sequelize.define("Tutorial", {
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    published: {
      type: DataTypes.BOOLEAN,
    },
  });


  return Tutorial;
};
