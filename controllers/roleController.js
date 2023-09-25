const db = require("../models");
const Role = db.roles;

exports.create = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validate request
    if (!title) {
      return res.status(400).send({
        message: "Title cannot be empty!",
      });
    }

    const role = await Role.create({
      title: title,
      description: description,
      UserId: req.params.id,
    });

    return res.status(201).send(role);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: error.message || "Some error occurred while creating the Role.",
    });
  }
};
