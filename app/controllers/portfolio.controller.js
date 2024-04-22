const {
  portfolio: Portfolio,
  diamonds: Diamonds,
  user: User,
  portfolio_products,
} = require("../models");

exports.getPortfolio = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      res.status(400).send({ message: "userId is required" });
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }
    if (!user.portfolio_id) {
      res.status(404).send({ message: "portfolio not attached to user" });
      return;
    }
    const portfolio = await Portfolio.findByPk(user.portfolio_id, {
      attributes: ["id", "wallet_amount"],
    });
    if (!portfolio) {
      res.status(404).send({ message: "portfolio not found" });
      return;
    }
    const products = await portfolio_products.findAll({
      where: {
        portfolio_id: portfolio.id,
      },
    });

    res.send({ ...portfolio.toJSON(), products });
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
