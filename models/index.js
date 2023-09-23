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
db.categories = require("./Category")(sequelize, Sequelize);
db.discounts = require("./Discount")(sequelize, Sequelize);
db.variants = require("./Variant")(sequelize, Sequelize);
db.reviews = require("./Review")(sequelize, Sequelize);
db.carts = require("./Cart")(sequelize, Sequelize);
db.cartvariants = require("./CartVariant")(sequelize, Sequelize);
db.ordervariants = require("./orderVariant")(sequelize, Sequelize);

db.users.hasMany(db.tutorials, { as: "Tutorial" });
db.tutorials.belongsTo(db.users);

db.users.hasMany(db.roles, { as: "Role" });
db.roles.belongsTo(db.users);

db.users.hasMany(db.address, { as: "Address" });
db.address.belongsTo(db.users);

db.categories.hasMany(db.products, { as: "Product" });
db.products.belongsTo(db.categories);

db.products.hasMany(db.variants, { as: "Variant" });
db.variants.belongsTo(db.products);

db.users.hasMany(db.reviews);
db.reviews.belongsTo(db.users);

db.products.hasMany(db.reviews);
db.reviews.belongsTo(db.products);

// Associations
db.users.hasOne(db.carts);
db.carts.belongsTo(db.users);

db.carts.belongsToMany(db.variants, { through: "CartVariants" });
db.variants.belongsToMany(db.carts, { through: "CartVariants" });
db.cartvariants.belongsTo(db.carts);
db.cartvariants.belongsTo(db.variants);

db.users.hasOne(db.orders);
db.orders.belongsTo(db.users);

db.orders.belongsToMany(db.variants, { through: "OrderVariants" });
db.variants.belongsToMany(db.orders, { through: "OrderVariants" });
db.ordervariants.belongsTo(db.orders);
db.ordervariants.belongsTo(db.variants);

module.exports = db;
