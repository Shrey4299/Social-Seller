const db = require("../models");
const { Op } = require("sequelize");

exports.searchProducts = async (req, res) => {
  const query = req.query.q;

  try {
    const products = await db.products.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${query}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${query}%`,
            },
          },
        ],
      },
      include: [
        {
          model: db.variants,
          as: "Variant",
        },
      ],
    });

    const categories = await db.categories.findAll({
      where: {
        name: {
          [Op.iLike]: `%${query}%`,
        },
      },
    });

    const variants = await db.variants.findAll({
      where: {
        [Op.or]: [
          {
            color: {
              [Op.iLike]: `%${query}%`,
            },
          },
          {
            size: {
              [Op.iLike]: `%${query}%`,
            },
          },
        ],
      },
      include: [
        {
          model: db.products,
          as: "Product",
        },
      ],
    });

    return res.status(200).send({ products, categories, variants });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
