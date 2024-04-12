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
  const { name, price, category, subcategory } = req.body;
  if (!name || !price || !category || !subcategory) {
    res.status(400).send({ message: "data is missing" });
    return;
  }
  // Save Diamond to Database
  Diamonds.create({
    name,
    price,
    category,
    subcategory,
  })
    .then((diamond) => {
      res.status(201).send({
        message: "Diamond created successfully!",
        data: diamond.dataValues,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.deleteDiamond = (req, res) => {
  const { diamondId } = req.params;
  if (!diamondId) {
    res.status(400).send({ message: "diamondId is missing" });
    return;
  }
  // Save Diamond to Database
  Diamonds.destroy({
    where: {
      id: diamondId,
    },
  })
    .then(() => {
      res.status(200).send({
        message: "Diamond deleted successfully!",
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.editDiamond = (req, res) => {
  const { diamondId } = req.params;
  const { name, price, category, subcategory } = req.body;
  if (!diamondId || !name || !price || !category || !subcategory) {
    res.status(400).send({ message: "data is missing" });
    return;
  }
  // Save Diamond to Database
  Diamonds.update(
    {
      name,
      price,
      category,
      subcategory,
    },
    {
      where: {
        id: diamondId,
      },
    }
  )
    .then(() => {
      res.status(200).send({
        message: "Diamond updated successfully!",
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
