const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Role = sequelize.define("Role", {
    title: {
      type: DataTypes.ENUM("admin", "authenticated", "user"),
    },
    description: {
      type: DataTypes.STRING,
    },
  });

  return Role;
};
