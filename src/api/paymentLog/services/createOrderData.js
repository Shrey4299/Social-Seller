const db = require("../../../services");

const getOrderData = async (
  couponCode,
  VariantId,
  quantity,
  UserId,
  payment
) => {
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

  return orderData;
};

module.exports = { getOrderData };
