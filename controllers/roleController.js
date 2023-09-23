const db = require("../models");
const Role = db.roles;

exports.create = (req, res) => {
  const { title, description } = req.body;

  // Validate request
  if (!title) {
    return res.status(400).send({
      message: "Title cannot be empty!",
    });
  }

  Role.create({
    title: title,
    description: description,
    UserId: req.params.id,
  })
    .then((role) => {
      res.send(role);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Role.",
      });
    });
};