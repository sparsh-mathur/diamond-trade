const { referrals: Referrals, user: User } = require("../models");
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
