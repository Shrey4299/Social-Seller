const db = require("../models");
const Variant = db.variants;

// image Upload
const multer = require("multer");
const path = require("path");

exports.create = async (req, res) => {
  try {
    const color = req.body.color;
    const size = req.body.size;
    const quantity = req.body.quantity;
    const price = req.body.price;
    const ProductId = req.params.id;
    const image = req.file.path;

    // Validate request
    if (!color || !size || !quantity || !price || !ProductId) {
      return res.status(400).send({
        message: "All fields are required!",
      });
    }

    const variant = await Variant.create({
      color: color,
      size: size,
      quantity: quantity,
      price: price,
      ProductId: ProductId,
      image: image,
    });

    res.send(variant);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Variant.",
    });
  }
};

// Function to handle image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

exports.upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Changed the string to a number
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give proper files format to upload");
  },
}).single("image");
