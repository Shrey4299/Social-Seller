const db = require("../../../services");
const Category = db.categories;

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
    const categories = await Category.findAll();
    return res.status(200).send(categories);
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving categories.",
    });
  }
};
