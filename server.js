const express = require("express");
const app = express();
const routes = require("./routes");
require("dotenv").config();
const db = require("./models");
const path = require("path");
const globalNotFoundHandler = require("./middlewares/globalNotFoundHandler");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

db.sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.use("/uploads", express.static("./uploads"));

// Define your routes
app.use("/api", routes);

// Add globalNotFoundHandler as the last middleware
app.use(globalNotFoundHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
