const {
  referrals: Referrals,
  user: User,
  portfolio: Portfolio,
} = require("../models");
const randomstring = require("randomstring");

exports.createReferral = (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    res.status(400).send({ message: "User ID is required" });
    return;
  }
  const referralCode = randomstring.generate(7);
  Referrals.create({
    referralCode,
    userId,
  })
    .then((code) => {
      res.send(code);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.useReferral = (req, res) => {
  const { referralCode, userId } = req.body;
  if (!referralCode || !userId) {
    res.status(400).send({ message: "Referral code and user ID are required" });
    return;
  }

  User.update(
    {
      referralCode,
    },
    {
      where: {
        id: userId,
      },
    }
  )
    .then(() => {
      res.send({ message: "Referral code added to user" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.addBenefit = async (req, res) => {
  const { amount, userId } = req.body;
  if (!amount || !userId) {
    res.status(400).send({ message: "amount and user ID are required" });
    return;
  }

  const user = User.findByPk(userId);
  if (!user) {
    res.status(404).send({ message: "User not found" });
    return;
  }
  const userPortfolio = Portfolio.findOne({
    where: {
      userId,
    },
  });
  if (!userPortfolio) {
    res.status(404).send({ message: "User portfolio not found" });
    return;
  }
  userPortfolio.wallet_amount += amount;
  await userPortfolio.save();
  res.send({ message: `Benefit of Rs ${amount} added to user's portfolio` });
};
