require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");

const { server, app } = require("./http");

const db = require("./src/services/index");
const globalNotFoundHandler = require("./src/middlewares/globalNotFoundHandler");
const userRoutes = require("./src/api/user/routes/user");
const addressRoutes = require("./src/api/address/routes/address");
const roleRoutes = require("./src/api/role/routes/role");
const productRoutes = require("./src/api/product/routes/product");
const categoryRoutes = require("./src/api/category/routes/category");
const variantRoutes = require("./src/api/variant/routes/variant");
const orderRoutes = require("./src/api/order/routes/order");
const cartRoutes = require("./src/api/cart/routes/cart");
const paymentLogRoutes = require("./src/api/paymentlog/routes/paymentlog");
const discountRoutes = require("./src/api/discount/routes/discount");
const reviewRoutes = require("./src/api/review/routes/review");
const sampleRoutes = require("./src/api/sample/routes/sample");

app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.use("/public/uploads", express.static("./public/uploads"));

const initializeSocketServer = require("./utils/socketModule");
const io = initializeSocketServer(server);

// app.post("/api/xyz", (req, res) => {
//   res.send("Welcome to the server!");

//   // Emit a message to the client when they hit the home route
//   io.emit("sampleMessage", "You are in the xyz route!");
// });

app.use("/api", userRoutes);
app.use("/api", addressRoutes);
app.use("/api", roleRoutes);
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", orderRoutes);
app.use("/api", cartRoutes);
app.use("/api", paymentLogRoutes);
app.use("/api", variantRoutes);
app.use("/api", discountRoutes);
app.use("/api", reviewRoutes);
app.use("/api", sampleRoutes);

app.use(globalNotFoundHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Socket.IO Logic

module.exports = { app, io };
