const dbConfig = require("../../database/config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  logging: false,

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

db.users = require("../api/user/models/user")(sequelize, Sequelize);
db.address = require("../api/address/models/address")(sequelize, Sequelize);
db.roles = require("../api/role/models/role")(sequelize, Sequelize);
db.products = require("../api/product/models/product")(sequelize, Sequelize);
db.variants = require("../api/variant/models/variant")(sequelize, Sequelize);
db.reviews = require("../api/review/models/Review")(sequelize, Sequelize);
db.categories = require("../api/category/models/category")(
  sequelize,
  Sequelize
);
db.discounts = require("../api/discount/models/discount")(sequelize, Sequelize);
db.orders = require("../api/order/models/order")(sequelize, Sequelize);
db.ordervariants = require("../api/order/models/orderVariant")(
  sequelize,
  Sequelize
);
db.carts = require("../api/cart/models/cart")(sequelize, Sequelize);
db.cartvariants = require("../api/cart/models/cartVariant")(
  sequelize,
  Sequelize
);
db.paymentlogs = require("../api/paymentLog/models/paymentLog")(
  sequelize,
  Sequelize
);
db.phonepepaymentlogs = require("../api/phonepePaymentLog/models/phonepeLog")(
  sequelize,
  Sequelize
);

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
