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
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    order_id,
  } = req.body;

  console.log(order_id);

  const generated_signature = crypto
    .createHmac("sha256", RAZORPAY_SECRET_KEY)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    db.orders
      .findByPk(order_id)
      .then((order) => {
        if (!order) {
          return res
            .status(404)
            .json({ success: false, message: "Order not found" });
        }

        order.update({
          razorpayId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          isPaid: true,
          status: "accepted",
          payment: "prepaid",
        });

        return res.json({ success: true, message: "Payment successful" });
      })
      .catch((error) => {
        console.error(error);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      });
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
