require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

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
const { sendTestEmail } = require("./src/services/emailSender");
const cors = require("cors"); // Added this line

// Setting up routes

const app = express();
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
  // .sync({ force: true })
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.use("/public/uploads", express.static("./public/uploads"));

const SENDER_EMAIL_ID = "shreyansh.socialseller@gmail.com";

app.get("/send-email", async (_, res) => {
  try {
    if (SENDER_EMAIL_ID === "EMAIL_ID") {
      throw new Error(
        "Please update SENDER_EMAIL_ID with your email id in server.js"
      );
    }
    const info = await sendTestEmail(SENDER_EMAIL_ID);
    res.send(info);
  } catch (error) {
    res.send(error);
  }
});

// Define your routes
app.use("/api", userRoutes);
app.use("/api", addressRoutes);
app.use("/api", roleRoutes);
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", orderRoutes);
app.use("/api", cartRoutes);
app.use("/api", paymentLogRoutes);
app.use("/api", variantRoutes);

// Add globalNotFoundHandler as the last middleware
app.use(globalNotFoundHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
