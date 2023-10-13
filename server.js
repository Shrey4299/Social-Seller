require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

// const db = require("./src/api/user/routes/routes");
const globalNotFoundHandler = require("./src/middlewares/globalNotFoundHandler");
const userRoutes = require("./src/api/user/routes/user");
const addressRoutes = require("./src/api/address/routes/address");
const roleRoutes = require("./src/api/role/routes/role");
const productRoutes = require("./src/api/product/routes/product");
const categoryRoutes = require("./src/api/category/routes/category");
const variantRoutes = require("./src/api/variant/models/variant");
const orderRoutes = require("./src/api/order/routes/order")

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// db.sequelize
//   .sync()
//   // .sync({ force: true })
//   .then(() => {
//     console.log("Synced db.");
//   })
//   .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
//   });

app.use("/public/uploads", express.static("./public/uploads"));

// Define your routes
app.use("/api", userRoutes);
app.use("/api", addressRoutes);
app.use("/api", roleRoutes);
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", variantRoutes);
app.use("/api", orderRoutes);

// Add globalNotFoundHandler as the last middleware
app.use(globalNotFoundHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
