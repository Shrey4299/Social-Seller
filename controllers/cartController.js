const db = require("../models");
const Cart = db.carts;
const CartVariant = db.cartvariants;
const Variant = db.variants;

exports.create = async (req, res) => {
  try {
    const UserId = req.user.id;

    // Validate request
    if (!UserId) {
      return res.status(400).send({
        message: "All fields are required!",
      });
    }

    const cart = await Cart.create({
      UserId,
    });

    res.status(201).send(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: error.message || "Some error occurred while creating the Cart.",
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { VariantId, quantity } = req.body;

    if (!VariantId || !quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).send({
        message:
          "Invalid input. Please provide valid VariantId, CartId, and quantity.",
      });
    }

    const UserId = req.user.id;

    console.log(UserId + " this is user id");

    // Find all cart variants associated with the user
    const cart = await Cart.findOne({
      where: { UserId: UserId },
    });

    const existingCartVariant = await CartVariant.findOne({
      where: {
        VariantId: VariantId,
        CartId: cart.id,
      },
    });

    if (existingCartVariant) {
      // If the variant is already in the cart, update the quantity
      existingCartVariant.quantity += quantity;
      await existingCartVariant.save();
    } else {
      // If the variant is not in the cart, create a new entry
      await CartVariant.create({
        VariantId: VariantId,
        CartId: cart.id,
        quantity: quantity,
      });
    }

    res.status(200).send({ message: "Variant added to cart successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.findOne = async (req, res) => {
  try {
    const UserId = req.params.userId;

    const cartVariants = await CartVariant.findAll({
      include: [
        { model: db.carts, where: { UserId: UserId } },
        { model: db.variants },
      ],
    });

    console.log(cartVariants);
    if (!cartVariants) {
      return res.status(404).send({
        message: `No cart variants found for user with id=${userId}`,
      });
    }

    // Calculate total price
    let totalPrice = 0;
    for (const cartVariant of cartVariants) {
      totalPrice += cartVariant.quantity * cartVariant.Variant.price;
    }

    // Add total price to each variant
    const variantsWithTotalPrice = cartVariants.map((cartVariant) => {
      return {
        ...cartVariant.toJSON(),
        totalVariantPrice: cartVariant.quantity * cartVariant.Variant.price,
      };
    });

    res.status(200).send({
      cartVariants: variantsWithTotalPrice,
      totalPrice: totalPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

exports.emptyCart = async (req, res) => {
  try {
    const UserId = req.user.id;
    const cart = await Cart.findOne({
      where: { UserId: UserId },
    });

    if (!cart) {
      return res.status(404).send({
        message: `Cart for user with id=${UserId} not found.`,
      });
    }

    const numDeleted = await CartVariant.destroy({
      where: { CartId: cart.id },
    });

    if (numDeleted > 0) {
      res.status(200).send({
        message: "Cart was emptied successfully!",
      });
    } else {
      res.status(404).send({
        message: `No cart items found for user with id=${UserId}.`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
