const db = require("../../../services");


const checkPaymentLog = async (req, res, next) => {
  try {
    console.log("inside payment log check");
    const paymentLogId = req.body.payload.payment.entity.status; // Assuming order_id is available in the request body

    console.log(req.body);

    const paymentLog = await db.paymentlogs.findByPk(paymentLogId);

    if (paymentLog && paymentLog.status == "captured") {
      return res
        .status(404)
        .json({ success: false, message: "Payment log exit" });
    }

    // Proceed with payment
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = checkPaymentLog;
