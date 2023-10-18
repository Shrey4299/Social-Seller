const { name } = require("ejs");
const db = require("../../../services");
const User = db.users;
const fs = require("fs");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const { sendOrderConfirmationEmail } = require("../../../services/emailSender");
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

    const name = req.body.name;
    const email = req.body.email;
    const task = "created";
    const createdUser = await User.create(user);

    const htmlContent = fs.readFileSync("./views/accountCreated.ejs", "utf8");
    const renderedContent = ejs.render(htmlContent, {
      name,
      task,
    });

    await sendOrderConfirmationEmail(email, renderedContent);

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
  const id = req.user.id;

  // Validate request
  if (!id) {
    return res.status(400).send({
      message: "All fields are required!",
    });
  }

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
    const { password, ...updatedData } = req.body;

    const [updatedRowsCount, [user]] = await User.update(updatedData, {
      where: { id: id },
      returning: true,
    });

    if (updatedRowsCount > 0) {
      const name = user.name;
      const email = user.email;
      const task = "updated";

      const htmlContent = fs.readFileSync("./views/accountCreated.ejs", "utf8");
      const renderedContent = ejs.render(htmlContent, {
        name,
        task,
      });

      await sendOrderConfirmationEmail(email, renderedContent);
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
      message: "Error updating User with id=" + id + error,
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

exports.resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const userId = req.params.id;

  try {
    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).send({
        message: "Passwords do not match.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the database
    const [updatedRowsCount, [user]] = await User.update(
      { password: hashedPassword },
      {
        where: { id: userId },
        returning: true,
      }
    );

    if (updatedRowsCount > 0) {
      const name = user.name;
      const email = user.email;

      const htmlContent = fs.readFileSync("./views/resetPassword.ejs", "utf8");
      const renderedContent = ejs.render(htmlContent, {
        name,
      });

      await sendOrderConfirmationEmail(email, renderedContent);
      return res.status(200).send({
        message: "Password reset successful.",
      });
    } else {
      return res.status(404).send({
        message: `User with id=${userId} not found.`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Error resetting password.",
    });
  }
};
