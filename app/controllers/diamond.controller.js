const { Op, Sequelize } = require("sequelize");
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
    oldPrice: price,
    category,
    subcategory,
    imageUrl: req.file ? req.file.location : null,
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

exports.editDiamond = async (req, res) => {
  const { diamondId } = req.params;
  const { name, price, category, subcategory } = req.body;
  if (!diamondId || !name || !price || !category || !subcategory) {
    res.status(400).send({ message: "data is missing" });
    return;
  }
  const diamond = await Diamonds.findOne({
    where: {
      id: diamondId,
    },
  });

  if (!diamond) {
    res.status(404).send({ message: "Diamond not found" });
    return;
  }

  diamond
    .update({
      name,
      price,
      oldPrice: diamond.price,
      category,
      subcategory,
    })
    .then(() => {
      res.status(200).send({
        message: "Diamond updated successfully!",
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getTrendingDiamonds = async (_, res) => {
  try {
    const upTrendDiamonds = await Diamonds.findAll({
      where: {
        price: {
          [Op.gt]: Sequelize.col("oldPrice"),
        },
      },
      order: [[Sequelize.literal(`(price  - "oldPrice")`), "DESC"]],
    });

    const downTrendDiamonds = await Diamonds.findAll({
      where: {
        [Op.or]: {
          price: {
            [Op.lt]: Sequelize.col("oldPrice"),
          },
          oldPrice: {
            [Op.eq]: null,
          },
        },
      },
      order: [[Sequelize.literal(`("oldPrice"  - price)`), "DESC"]],
    });
    res.send({
      upTrendDiamonds,
      downTrendDiamonds,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
