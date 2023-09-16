const db = require("../models");
const Address = db.address;

exports.create = (req, res) => {
  if (!req.body.Country || !req.body.State || !req.body.City) {
    res.status(400).send({
      message: "Country, State, and City are required fields!",
    });
    return;
  }

  const address = {
    Country: req.body.Country,
    State: req.body.State,
    City: req.body.City,
    Pincode: req.body.Pincode || null,
    UserId: req.body.UserId ,
  };

  Address.create(address)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Address.",
      });
    });
};
