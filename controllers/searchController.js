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

const category = await db.categories.findAll({
  where: {
    name: {
      [Op.iLike]: `%${query}%`,
    },
  },
});

    res.send({ products , category});
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
