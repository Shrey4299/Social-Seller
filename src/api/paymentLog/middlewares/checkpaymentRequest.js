const db = require("../../../services");

const checkPaymentRequest = async (req, res, next) => {
  try {
    const { payment, UserId, VariantId, quantity } = req.body;

    if (!UserId || !payment || !VariantId || !quantity) {
      return res.status(400).send({
        message:
          "User , payment and other methods amethod are required fields!",
      });
    }

    // Proceed with payment
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error in create order",
      });
  }
};

module.exports = checkPaymentRequest;
