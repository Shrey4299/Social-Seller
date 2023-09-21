const db = require("../models");
const Category = db.categories;

exports.create = (req, res) => {
  const { name } = req.body;

  // Validate request
  if (!name) {
    return res.status(400).send({
      message: "Category name cannot be empty!",
    });
  }

  Category.create({
    name: name,
  })
    .then((category) => {
      res.send(category);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Role.",
      });
    });
};

exports.findAll = (req, res) => {
  Category.findAll()
    .then((categories) => {
      res.send(categories);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving categories.",
      });
    });
};