// const Razorpay = require("razorpay");
// const crypto = require("crypto");
// const db = require("../models");
// const { update } = require("./tutorialController");
// const Order = db.orders;

// const razorpay = new Razorpay({
//   key_id: "rzp_test_pqY2CKDdQMYzP5",
//   key_secret: "CAVx8E8hrETOUe7sdLvKWHjB",
// });

// exports.createOrder = (req, res) => {
//   const { order_id } = req.body;

//   Order.findOne({ where: { id: order_id } }).then((order) => {
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     const params = {
//       amount: order.price,
//       currency: "INR",
//       receipt: `order_${Date.now()}`,
//       payment_capture: 1,
//     };

//     razorpay.orders.create(params, async (err, razorpayOrder) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send("Internal Server Error");
//       } else {
//         try {
//           console.log(razorpayOrder);

//           console.log(razorpayOrder.id);
//           console.log(razorpayOrder.receipt);

//           const updatedBody = {
//             razorpayId: razorpayOrder.id,
//             razorpayOrderId: razorpayOrder.receipt,
//             isPaid: true, // Assuming you want a boolean value
//           };

//           await Order.update(updatedBody, {
//             where: { id: order_id },
//           });

//           const response = {
//             ...razorpayOrder,
//             razorpayId: razorpayOrder.id, // Use the newly generated ID
//             razorpayOrderId: razorpayOrder.receipt, // Use the generated receipt
//             isPaid: true,
//           };

//           res.json(response);
//         } catch (error) {
//           console.error(error);
//           return res.status(500).send("Internal Server Error");
//         }
//       }
//     });
//   });
// };

// exports.verifyPayment = (req, res) => {
//   const { order_id, payment_id, signature } = req.body;

//   const generated_signature = crypto
//     .createHmac("sha256", "rzp_test_pqY2CKDdQMYzP5")
//     .update(`${order_id}|${payment_id}`)
//     .digest("hex");

//   if (generated_signature === signature) {
//     res.json({ success: true, message: "Payment successful" });
//   } else {
//     res.status(400).json({ success: false, message: "Invalid signature" });
//   }
// };
