const db = require("../../../services");
const Sequelize = db.Sequelize;
const Product = db.products;
const { getPagination, getMeta } = require("../../../../utils/pagination");
const { json } = require("body-parser");

exports.create = async (req, res) => {
  try {
    if (!req.body.name || !req.body.description) {
      return res.status(400).send({
        message: "All fields are required!",
      });
    }

    const product = {
      name: req.body.name,
      description: req.body.description,
      CategoryId: req.params.id,
    };

    const createdProduct = await Product.create(product);

    return res.status(201).send(createdProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Some error occurred while creating the Product.",
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const pagination = await getPagination({ page, pageSize });
    const products = await Product.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
      include: [
        { model: db.variants, as: "Variant" },
        { model: db.reviews, as: "Reviews" },
      ],
    });

    const meta = await getMeta(pagination, products.count);

    return res.status(200).send({ data: products.rows, meta });
  } catch (error) {
    console.error(error);
    return res.status(400).send({
      message: error.message,
    });
  }
};

exports.findProductByCategory = async (req, res) => {
  try {
    const { category_id } = req.params;

    // Validate request
    if (!category_id) {
      return res.status(400).send({
        message: "Category ID cannot be empty!",
      });
    }

    const category = await db.categories.findOne({
      where: { id: category_id },
    });

    if (!category) {
      return res.status(204).send({
        message: `Category with ID ${category_id} not found.`,
      });
    }

    const products = await Product.findAll({
      where: {
        CategoryId: category.id,
      },
    });

    return res.status(200).send(products);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Some error occurred while retrieving products.",
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Product.findByPk(id, {
      include: [
        { model: db.variants, as: "Variant" },
        { model: db.reviews, as: "Reviews" },
      ],
    });

    if (data) {
      const averageRating = await db.reviews.findOne({
        attributes: [
          [Sequelize.fn("AVG", Sequelize.col("rating")), "averageRating"],
        ],
        where: {
          ProductId: id,
        },
      });

      // data.setDataValue("averageRating", averageRating.averageRating);

      console.log(JSON.stringify(averageRating) + "this is average rating");
      return res.status(200).send({ data, averageRating });
    } else {
      return res.status(204).send({
        message: `Product with id=${id} was not found.`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Error retrieving Product with id=" + id,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const [num] = await Product.update(req.body, {
      where: { id: id },
    });

    if (num === 1) {
      return res.status(201).send({
        message: "Product was updated successfully.",
      });
    } else {
      return res.status(204).send({
        message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Error updating Product with id=" + id,
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;

    const num = await Product.destroy({
      where: { id: id },
    });

    if (num === 1) {
      return res.status(201).send({
        message: "Product was deleted successfully!",
      });
    } else {
      return res.status(204).send({
        message: `Cannot delete Product with id=${id}. Maybe Product was not found!`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Could not delete Product with id=" + id,
    });
  }
};
