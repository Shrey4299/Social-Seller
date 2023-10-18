const db = require("../../../services");
const Role = db.roles;

exports.create = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.params.id;

    // Check if a role already exists for the user
    const existingRole = await Role.findOne({ where: { UserId: userId } });

    if (existingRole) {
      // Update the existing role
      await existingRole.update({ title, description });
      return res.status(200).send(existingRole);
    }

    // Create a new role
    const role = await Role.create({
      title: title,
      description: description,
      UserId: userId,
    });

    return res.status(201).send(role);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message:
        error.message ||
        "Some error occurred while creating/updating the Role.",
    });
  }
};
