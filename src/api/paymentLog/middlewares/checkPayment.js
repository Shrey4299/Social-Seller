const db = require("../../../services");

const checkPayment = async (req, res, next) => {
  try {
    const order_id = req.body.mainId; // Assuming order_id is available in the request body

    console.log(req.body);

    const order = await db.orders.findByPk(order_id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.isPaid) {
      return res
        .status(400)
        .json({ success: false, message: "Order is already paid" });
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

module.exports = checkPayment;
