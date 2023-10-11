const db = require("../models");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();
const axios = require("axios");

const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY,
});

const renderProductPage = async (req, res) => {
  try {
    const orders = await db.orders.findAll();
    const orderVariants = await db.ordervariants.findAll();
    res.render("product", { orders, orderVariants });
  } catch (error) {
    console.log(error.message);
  }
};

const renderPhonepePage = async (req, res) => {
  try {
    res.render("phonepe");
  } catch (error) {
    console.log(error.message);
  }
};

const renderPhonepeSuccess = async (req, res) => {
  try {
    const responseData = {
      success: true,
      code: "PAYMENT_INITIATED",
      message: "Payment initiated",
      data: {
        merchantId: "PGTESTPAYUAT",
        merchantTransactionId: "MT785058104",
        instrumentResponse: { type: "PAY_PAGE", redirectInfo: {} },
      },
    };

    res.render("phonepeSuccess", {
      code: responseData.code,
      transactionId: responseData.data.merchantTransactionId,
      providerReferenceId: responseData.data.merchantId,
      data: responseData.data,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const makePhonepePayment = async (req, res) => {
  try {
    console.log("entered make phonepe payment");
    const amount = req.body.amountEnterByUsers;

    const merchantId = "PGTESTPAYUAT";
    const saltKey = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";

    const data = {
      merchantId: merchantId,
      merchantTransactionId: "MT785058104",
      merchantUserId: "MUID123",
      amount: amount * 100,
      redirectUrl: "http://localhost:8080/api/phonepeSuccess/",
      redirectMode: "POST",
      callbackUrl: "http://localhost:8080/api/phonepeSuccess/",
      mobileNumber: "9825454588",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payloadMain = Buffer.from(JSON.stringify(data)).toString("base64");
    const payload = `${payloadMain}/pg/v1/pay${saltKey}`;
    const Checksum =
      require("crypto").createHash("sha256").update(payload).digest("hex") +
      "###1";

    console.log(Checksum);
    const response = await axios.post(
      "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
      {
        request: payloadMain,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": Checksum,
          accept: "application/json",
        },
      }
    );

    const responseData = response.data;
    console.log(responseData);
    const url = responseData.data.instrumentResponse.redirectInfo.url;

    // status callback
    const options = {
      method: "GET",
      url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/MT785058104`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });

    // status callback

    res.redirect(url);
  } catch (error) {
    const errMessage = error.response ? error.response.data : error.message;
    res.redirect(`/api/phonepePaymentfailed?cURLError=${errMessage}`);
  }
};

let t;
console.log(t);
db.sequelize
  .transaction()
  .then((result) => {
    t = result;
  })
  .catch((err) => {
    throw err;
  });

const createOrder = async (req, res) => {
  try {
    console.log("from create order");
    const { payment, couponCode, UserId, VariantId, quantity } = req.body;

    if (!UserId || !payment) {
      await t.rollback();
      t = undefined;

      return res.status(400).send({
        message: "User and payment method are required fields!",
      });
    }

    const discount = await db.discounts.findOne({
      where: { name: couponCode },
    });

    const variant = await db.variants.findByPk(VariantId);

    const finalPrice = discount
      ? variant.price * quantity - discount.discountPercentage
      : variant.price * quantity;

    const address = await db.address.findOne({
      where: { UserId: UserId },
    });

    const orderData = {
      price: finalPrice,
      UserId: UserId,
      payment: payment,
      status: "new",
      address: address.id,
      isPaid: false,
    };

    const createdOrder = await db.orders.create(orderData, { transaction: t });

    const order = await db.orders.findByPk(createdOrder.id, { transaction: t });

    const [orderVariant, created] = await db.ordervariants.findOrCreate({
      where: {
        VariantId: VariantId,
        OrderId: order.id,
      },
      defaults: {
        quantity: quantity,
        price: variant.price,
        OrderId: order.id,
        VariantId: VariantId,
      },
      transaction: t,
    });

    const newPrice = order.price + quantity * variant.price;
    await order.update({ price: newPrice }, { transaction: t });

    const amount = newPrice * 100;
    const mainId = order.id;

    const options = {
      amount: amount,
      currency: "INR",
      receipt: "razorUser@gmail.com",
    };

    razorpayInstance.orders.create(options, async (err, order) => {
      if (!err) {
        res.status(200).send({
          success: true,
          msg: "Order Created",
          order_id: order.id,
          amount: amount,
          key_id: RAZORPAY_ID_KEY,
          product_name: variant.name,
          description: variant.description,
          contact: "8567345632",
          name: "Shreyansh Dewangan",
          email: "shrey@gmail.com",
          mainId: mainId,
        });
      } else {
        console.error(err);
        await t.rollback();
        t = undefined;

        res.status(400).send({ success: false, msg: "Something went wrong!" });
      }
    });
  } catch (err) {
    await t.rollback();
    t = undefined;

    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

const verifyPaymentWebhook = async (req, res) => {
  try {
    const secret = "1234";
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest === req.headers["x-razorpay-signature"]) {
      const paymentData = req.body.payload.payment.entity;

      const paymentLog = await db.paymentlogs.create(
        {
          account_id: req.body.account_id,
          id: paymentData.id,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: paymentData.status,
          order_id: paymentData.order_id,
          method: paymentData.method,
          card: paymentData.card,
          description: paymentData.description,
          card_id: paymentData.card_id,
          bank: paymentData.bank,
          wallet: paymentData.wallet,
          vpa: paymentData.vpa,
          email: paymentData.email,
          contact: paymentData.contact,
          error_code: paymentData.error_code,
          error_description: paymentData.error_description,
          acquirer_data: paymentData.acquirer_data,
          upi: paymentData.upi,
          base_amount: paymentData.base_amount || paymentData.amount,
        },
        { transaction: t }
      );

      console.log("Payment Log Created:", paymentLog);
    } else {
      console.log("Invalid signature. Passing request.");
    }

    res.json({ status: "ok" });
  } catch (error) {
    await t.rollback();
    t = undefined;
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
    } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", RAZORPAY_SECRET_KEY)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      await t.rollback();
      t = undefined;

      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    const order = await db.orders.findByPk(order_id, { transaction: t });

    if (!order) {
      await t.rollback();
      t = undefined;

      return res
        .status(400)
        .json({ success: false, message: "Order not found" });
    }

    await order.update(
      {
        razorpayId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        isPaid: true,
        status: "accepted",
        payment: "prepaid",
      },
      { transaction: t }
    );

    const orderVariants = await db.ordervariants.findAll(
      {
        where: {
          OrderId: order_id,
        },
      },
      { transaction: t }
    );

    for (const orderVariant of orderVariants) {
      const variant = await db.variants.findByPk(orderVariant.VariantId, {
        transaction: t,
      });

      if (!variant) {
        return res
          .status(404)
          .json({ success: false, message: "Variant not found" });
      }

      let variantQuantity = variant.quantity;

      await variant.update(
        {
          quantity: variantQuantity - orderVariant.quantity,
        },
        { transaction: t }
      );
    }

    await t.commit();
    t = undefined;

    return res
      .status(201)
      .json({ success: true, message: "Payment successful" });
  } catch (error) {
    console.error(error);
    await t.rollback();
    t = undefined;
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  renderProductPage,
  renderPhonepePage,
  renderPhonepeSuccess,
  createOrder,
  verifyPayment,
  verifyPaymentWebhook,
  makePhonepePayment,
};
