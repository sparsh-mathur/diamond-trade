const {
  portfolio: Portfolio,
  diamonds: Diamonds,
  diamonds,
} = require("../models");

exports.getPortfolio = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      res.status(400).send({ message: "userId is required" });
      return;
    }

    const portfolio = await Portfolio.findOne({
      where: {
        userId,
      },
    });

    if (!portfolio) {
      res.status(404).send({ message: "portfolio not found" });
      return;
    }

    const products = await JSON.parse(portfolio.products);
    const productIds = products.map((product) => product.productId);
    if (!productIds.length) {
      res.send({ ...portfolio.dataValues, diamonds: [] });
      return;
    }
    const diamonds = await Diamonds.findAll({
      where: {
        id: productIds,
      },
    });

    res.send({ ...portfolio.dataValues, diamonds });
  } catch (error) {
    console.error("error in finding", error);
    res.status(500).send({ message: error.message });
  }
};

exports.addMoney = (req, res) => {
  const { userId } = req.params;
  const { walletAmount } = req.body;
  console.log(req.body, userId);

  if (!userId || !walletAmount) {
    console.log({ userId, walletAmount });
    res.status(400).send({ message: "userId  or walletAmount is required" });
    return;
  }
  Portfolio.findOne({
    where: {
      userId,
    },
  })
    .then((portfolio) => {
      if (!portfolio) {
        res.status(404).send({ message: "portfolio not found" });
        return;
      }

      portfolio
        .increment({
          walletAmount: walletAmount,
        })
        .then((portfolio) => {
          console.log("portfolio updated", portfolio);
          res.send({
            message: `${walletAmount} Rs added to wallet successfully`,
            data: portfolio,
          });
        })
        .catch((err) => {
          console.log("error in updating", err);
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      console.log("error in finding", err);
      res.status(500).send({ message: err.message });
    });
};
