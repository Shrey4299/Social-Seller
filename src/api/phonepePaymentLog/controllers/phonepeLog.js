const db = require("../models");
const phonepepaymentlog = db.phonepepaymentlogs;
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();
const axios = require("axios");

const renderPhonepePage = async (req, res) => {
  try {
    res.render("phonepe");
  } catch (error) {
    console.log(error.message);
  }
};

const makePhonepePayment = async (req, res) => {
  try {
    console.log("entered make phonepe payment");

    console.log(req.body + " this is body");

    const { payment, couponCode, UserId, VariantId, quantity } = req.body;

    if (!UserId || !payment) {
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

    const createdOrder = await db.orders.create(orderData);

    const order = await db.orders.findByPk(createdOrder.id);

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
    });

    const newPrice = order.price + quantity * variant.price;
    await order.update({ price: newPrice });

    const amount = newPrice;
    const mainId = order.id;

    const merchantId = "PGTESTPAYUAT";
    const saltKey = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
    const merchantTransactionId = "MT785058104";

    const data = {
      merchantId: merchantId,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: "MUID123",
      amount: amount * 100,
      //   redirectUrl: "https://example.com",
      redirectMode: "REDIRECT",
      redirectUrl: "http://localhost:8080/api/phonepeSuccess",
      callbackUrl:
        "https://9cfb-115-245-32-172.ngrok-free.app/api/phonepeVerify",
      mobileNumber: "9825454588",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
      mainId: mainId,
    };

    const payloadMain = Buffer.from(JSON.stringify(data)).toString("base64");
    const payload = `${payloadMain}/pg/v1/pay${saltKey}`;
    const Checksum =
      require("crypto").createHash("sha256").update(payload).digest("hex") +
      "###1";

    console.log(Checksum);

    const response = await axios.post(
      "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
      { request: payloadMain },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": Checksum,
          accept: "application/json",
        },
      }
    );

    const responseData = response.data;
    responseData.mainId = mainId; // Added mainId to responseData

    console.log(responseData);

    const url = responseData.data.instrumentResponse.redirectInfo.url;
    res.redirect(url);
  } catch (error) {
    const errMessage = error.response ? error.response.data : error.message;
    res.redirect(`/api/phonepePaymentfailed?cURLError=${errMessage}`);
  }
};

const verifyPhonepePayment = async (req, res) => {
  try {
    console.log("entered verify");
    console.log(req.body);

    // Decode the request body
    const decodedBody = JSON.parse(
      Buffer.from(req.body.response, "base64").toString("utf-8")
    );

    // Extract relevant data
    const {
      merchantId,
      merchantTransactionId,
      transactionId,
      amount,
      paymentInstrument,
    } = decodedBody.data;

    // Now you can use these variables to perform your verification logic
    console.log(`Transaction ID: ${transactionId}`);
    console.log(`Amount: ${amount}`);
    console.log(`Payment Instrument Type: ${paymentInstrument.type}`);

    // Construct the payload for checksum calculation
    const payloadStatus = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;
    const saltKey = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
    const saltIndex = "1";

    // Calculate the checksum
    const checksumStatus =
      require("crypto")
        .createHash("sha256")
        .update(payloadStatus + saltKey)
        .digest("hex") +
      "###" +
      saltIndex;

    // Make the request to verify the payment
    const verifyResponse = await axios.get(
      `https://api-preprod.phonepe.com/apis/pg-sandbox${payloadStatus}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksumStatus,
          "X-MERCHANT-ID": merchantId,
        },
      }
    );

    const responseData = verifyResponse.data;
    console.log(responseData);

    const order = await db.orders.findByPk(order_id);

    if (!order) {
      return res
        .status(400)
        .json({ success: false, message: "Order not found" });
    }

    await order.update({
      razorpayId: responseData.data.transactionId,
      razorpayOrderId: responseData.data.merchantTransactionId,
      isPaid: true,
      status: "accepted",
      payment: "prepaid",
    });

    const orderVariants = await db.ordervariants.findAll({
      where: {
        OrderId: order_id,
      },
    });

    for (const orderVariant of orderVariants) {
      const variant = await db.variants.findByPk(orderVariant.VariantId);

      if (!variant) {
        return res
          .status(404)
          .json({ success: false, message: "Variant not found" });
      }

      let variantQuantity = variant.quantity;

      await variant.update({
        quantity: variantQuantity - orderVariant.quantity,
      });
    }

    await phonepepaymentlog.create({
      merchantId: responseData.data.merchantId,
      merchantTransactionId: responseData.data.merchantTransactionId,
      transactionId: responseData.data.transactionId,
      amount: responseData.data.amount,
      state: responseData.data.state,
      responseCode: responseData.data.responseCode,
      paymentInstrumentType: responseData.data.paymentInstrument.type,
      cardType: responseData.data.paymentInstrument.cardType,
      pgTransactionId: responseData.data.paymentInstrument.pgTransactionId,
      bankTransactionId: responseData.data.paymentInstrument.bankTransactionId,
      pgAuthorizationCode:
        responseData.data.paymentInstrument.pgAuthorizationCode,
      arn: responseData.data.paymentInstrument.arn,
      bankId: responseData.data.paymentInstrument.bankId,
      brn: responseData.data.paymentInstrument.brn,
    });

    // Further verification logic based on verifyResponse goes here...
  } catch (error) {
    const errMessage = error.response ? error.response.data : error.message;
    console.log(errMessage);
  }
};

const renderPhonepeSuccess = async (req, res) => {
  try {
    console.log("rendering phonepe Success");
    console.log(req.body);
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

module.exports = {
  makePhonepePayment,
  verifyPhonepePayment,
  renderPhonepePage,
  renderPhonepeSuccess,
};
