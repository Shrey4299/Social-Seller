const db = require("../models");
const Category = db.categories;

exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate request
    if (!name) {
      return res.status(400).send({
        message: "Category name cannot be empty!",
      });
    }

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
    return res.send(categories);
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving categories.",
    });
  }
};
