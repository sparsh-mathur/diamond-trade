const { portfolio: Portfolio, diamonds: Diamonds } = require("../models");

exports.getPortfolio = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).send({ message: "userId is required" });
    return;
  }

  Portfolio.findOne({
    userId,
  })
    .then((portfolio) => {
      Diamonds.findAll({
        where: {
          id: portfolio.productIds,
        },
      })
        .then((diamonds) => {
          portfolio.dataValues.diamonds = diamonds;
          res.send(portfolio);
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
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
        console.log("portfolio not found");
        Portfolio.create({
          userId,
          walletAmount,
          productIds: JSON.stringify([]),
        })
          .then((portfolio) => {
            console.log("portfolio created");
            res.send(portfolio);
          })
          .catch((err) => {
            console.log("error", err);
            res.status(500).send({ message: err.message });
          });
        return;
      }

      portfolio
        .increment({
          walletAmount: walletAmount,
        })
        .then((portfolio) => {
          console.log("portfolio updated", portfolio);
          res.send(portfolio);
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
