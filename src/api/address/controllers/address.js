const db = require("../../../services");
const Address = db.address;

exports.create = async (req, res) => {
  try {
    const address = {
      Country: req.body.Country,
      State: req.body.State,
      City: req.body.City,
      Pincode: req.body.Pincode || null,
      UserId: req.params.id,
    };

    const createdAddress = await Address.create(address);

    return res.status(201).send(createdAddress);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Address.",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const addressId = req.params.id;

    const updatedAddress = await Address.update(
      {
        Country: req.body.Country,
        State: req.body.State,
        City: req.body.City,
        Pincode: req.body.Pincode || null,
      },
      {
        where: {
          id: addressId,
        },
      }
    );

    if (updatedAddress[0] === 1) {
      return res.status(200).send({ message: "Address updated successfully" });
    } else {
      return res.status(404).send({ message: "Address not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message:
        error.message || "Some error occurred while updating the Address.",
    });
  }
};
