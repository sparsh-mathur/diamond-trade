const db = require("../models");
const Diamonds = db.diamonds;

exports.getAllDiamonds = (req, res) => {
  Diamonds.findAll({
    order: [
      ["category", "DESC"],
      ["subcategory", "DESC"],
    ],
  })
    .then((diamonds) => {
      res.send(diamonds);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.createDiamond = (req, res) => {
  if (
    !req.body.name ||
    !req.body.price ||
    !req.body.category ||
    !req.body.subcategory
  ) {
    res.status(400).send({ message: "data is missing" });
    return;
  }
  // Save Diamond to Database
  Diamonds.create({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    subcategory: req.body.subcategory,
  })
    .then((diamond) => {
      res.send({
        message: "Diamond registered successfully!",
        data: diamond.dataValues,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// exports.userBoard = (req, res) => {
//   res.status(200).send("User Content.");
// };

// exports.adminBoard = (req, res) => {
//   res.status(200).send("Admin Content.");
// };

// exports.moderatorBoard = (req, res) => {
//   res.status(200).send("Moderator Content.");
// };
