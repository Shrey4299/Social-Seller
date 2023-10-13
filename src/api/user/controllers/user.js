const db = require("../../../services");
const User = db.users;

// Create a new user
exports.create = async (req, res) => {
  try {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
      role: req.body.role,
    };

    const createdUser = await User.create(user);
    return res.status(201).send(createdUser);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: error.message || "Some error occurred while creating the User.",
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: db.address, as: "Address" },
        { model: db.roles, as: "Role" },
      ],
    });
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({
      message: error.message || "Some error occurred while retrieving users.",
    });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByPk(id);
    if (user) {
      return res.status(200).send(user);
    } else {
      return res.status(204).send({
        message: `User with id=${id} was not found.`,
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: "Error retrieving User with id=" + id,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [num] = await User.update(req.body, {
      where: { id: id },
    });

    if (num == 1) {
      return res.status(201).send({
        message: "User was updated successfully.",
      });
    } else {
      return res.status(204).send({
        message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: "Error updating User with id=" + id,
    });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await User.destroy({
      where: { id: id },
    });

    if (num == 1) {
      return res.status(202).send({
        message: "User was deleted successfully!",
      });
    } else {
      return res.status(204).send({
        message: `Cannot delete User with id=${id}. Maybe User was not found!`,
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: "Could not delete User with id=" + id,
    });
  }
};
