const dbConfig = require("../database/config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorials = require("./Tutorial")(sequelize, Sequelize);
db.users = require("./User")(sequelize, Sequelize);
db.products = require("./Product")(sequelize, Sequelize);
db.orders = require("./Order")(sequelize, Sequelize);
db.address = require("./Address")(sequelize, Sequelize);
db.roles = require("./Role")(sequelize, Sequelize);

db.users.hasMany(db.tutorials, { as: "Tutorial" });
db.tutorials.belongsTo(db.users);

db.users.hasMany(db.roles, { as: "Role" });
db.roles.belongsTo(db.users);

db.users.hasMany(db.orders, { as: "Order" });
db.orders.belongsTo(db.users);

db.users.hasMany(db.address, { as: "Address" });
db.address.belongsTo(db.users);

db.products.hasMany(db.orders, { as: "Order" });
db.orders.belongsTo(db.products);

// db.orders.belongsTo(db.products, {
//   foreignKey: "id",
// });

module.exports = db;
