const { Op, Sequelize, where } = require("sequelize");
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
    old_price: price,
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

  diamond.set({
    name,
    price,
    old_price: diamond.price,
    category,
    subcategory,
  });
  if (diamond.price !== diamond.old_price) {
    await db.product_price_change.create({
      product_id: diamondId,
      old_price: diamond.old_price,
      new_price: diamond.price,
    });
  }
  diamond
    .save()
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
          [Op.gt]: Sequelize.col("old_price"),
        },
      },
      order: [[Sequelize.literal(`(price  - old_price)`), "DESC"]],
    });

    const downTrendDiamonds = await Diamonds.findAll({
      where: {
        [Op.or]: {
          price: {
            [Op.lt]: Sequelize.col("old_price"),
          },
          old_price: {
            [Op.eq]: null,
          },
        },
      },
      order: [[Sequelize.literal(`(old_price  - price)`), "DESC"]],
    });
    res.send({
      upTrendDiamonds,
      downTrendDiamonds,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getPriceHistory = async (req, res) => {
  const { diamondId } = req.params;
  if (!diamondId) {
    res.status(400).send({ message: "diamondId is missing" });
    return;
  }
  try {
    const priceHistory = await db.product_price_change.findAll({
      where: {
        product_id: diamondId,
      },
      attributes: ["new_price", "createdAt"],
      order: [["createdAt", "DESC"]],
    });
    res.send(priceHistory);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
