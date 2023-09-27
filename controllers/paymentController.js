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
    const orderVariants = await db.ordervariants.findAll(); // Assuming your model is named 'Order'
    res.render("product", { orders });
  } catch (error) {
    console.log(error.message);
  }
};

const createOrder = async (req, res) => {
  try {
    console.log(JSON.stringify(req.body) + "this is request");
    const amount = req.body.amount * 100;
    const mainId = req.body.mainId;
    console.log(mainId + "this is main id");
    const options = {
      // mainId: mainId,
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
          mainId: mainId,
        });
      } else {
        res.status(400).send({ success: false, msg: "Something went wrong!" });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const verifyPayment = async (req, res) => {
  try {
    console.log("Inside Verify Payment");
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

    if (generated_signature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    const order = await db.orders.findByPk(order_id);

    if (!order) {
      return res
        .status(400)
        .json({ success: false, message: "Order not found" });
    }

    await order.update({
      razorpayId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      isPaid: true,
      status: "accepted",
      payment: "prepaid",
    });

    const orderVariant = await db.ordervariants.findOne({
      where: {
        OrderId: order_id,
      },
    });

    if (!orderVariant) {
      return res
        .status(404)
        .json({ success: false, message: "Order variant not found" });
    }

    const variant = await db.variants.findByPk(orderVariant.VariantId);

    if (!variant) {
      return res
        .status(404)
        .json({ success: false, message: "Variant not found" });
    }

    let variantQuantity = variant.quantity;

    await variant.update({
      quantity: variantQuantity - 1,
    });

    return res
      .status(201)
      .json({ success: true, message: "Payment successful" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const verifyPaymentWebhook = async (req, res) => {
  try {
    const secret = "1234";
    console.log("from web hioika");
    console.log(JSON.stringify(req.body));
    const crypto = require("crypto");

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    console.log(digest, req.headers["x-razorpay-signature"]);

    if (digest === req.headers["x-razorpay-signature"]) {
      console.log("Request is legitimate.");
      // Process the request data
      const fs = require("fs");
      fs.writeFileSync("payment1.json", JSON.stringify(req.body, null, 4));
    } else {
      console.log("Invalid signature. Passing request.");
      // Do nothing or handle as needed
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  renderProductPage,
  createOrder,
  verifyPayment,
  verifyPaymentWebhook,
};
