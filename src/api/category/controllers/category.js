const db = require("../../../services");
const Category = db.categories;
const { getPagination, getMeta } = require("../../../../utils/pagination");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.create({
      name: name,
    });

    return res.status(201).send(category);
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: err.message || "Some error occurred while creating the Role.",
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const pagination = await getPagination({ page, pageSize });

    const categories = await Category.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
    });

    const meta = await getMeta(pagination, categories.count);

    return res.status(200).send({ data: categories.rows, meta });
  } catch (error) {
    return res.status(500).send({
      message:
        error.message || "Some error occurred while retrieving categories.",
    });
  }
};
