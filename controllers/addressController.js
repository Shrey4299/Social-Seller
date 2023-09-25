const db = require("../models");
const Address = db.address;

exports.create = async (req, res) => {
  try {
    if (!req.body.Country || !req.body.State || !req.body.City) {
      return res.status(400).send({
        message: "Country, State, and City are required fields!",
      });
    }

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
