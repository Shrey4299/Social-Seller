const Razorpay = require("razorpay");
require("dotenv").config();
const db = require("../models");
const crypto = require("crypto");

const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

console.log(RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY);

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY,
});

const renderProductPage = async (req, res) => {
  try {
    const orders = await db.orders.findAll(); // Assuming your model is named 'Order'
    res.render("product", { orders });
  } catch (error) {
    console.log(error.message);
  }
};

const createOrder = async (req, res) => {
  try {
    const amount = req.body.amount * 100;
    const options = {
      amount: amount,
      currency: "INR",
      receipt: "razorUser@gmail.com",
    };

    razorpayInstance.orders.create(options, (err, order) => {
      if (!err) {
        res.status(200).send({
          success: true,
          msg: "Order Created",
          order_id: order.id,
          amount: amount,
          key_id: RAZORPAY_ID_KEY,
          product_name: req.body.name,
          description: req.body.description,
          contact: "8567345632",
          name: "Shreyansh Dewangan",
          email: "shrey@gmail.com",
        });
      } else {
        res.status(400).send({ success: false, msg: "Something went wrong!" });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const generated_signature = crypto
    .createHmac("sha256", RAZORPAY_SECRET_KEY)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    console.log(generated_signature);
    console.log(razorpay_signature);
    res.json({ success: true, message: "Payment successful" });
  } else {
    console.log("failed");
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
};

module.exports = {
  renderProductPage,
  createOrder,
  verifyPayment,
};
