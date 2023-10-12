const db = require("../models");
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

    const amount = req.body.amountEnterByUsers;
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
      state,
      responseCode,
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

    // Further verification logic based on verifyResponse goes here...
  } catch (error) {
    const errMessage = error.response ? error.response.data : error.message;
    console.log(errMessage);
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

module.exports = {
  makePhonepePayment,
  verifyPhonepePayment,
  renderPhonepePage,
  renderPhonepeSuccess,
};
