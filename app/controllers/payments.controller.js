const { Op } = require("sequelize");
const db = require("../models");
const Payments = db.payments;

exports.postPayment = (req, res) => {
  const { userId, amount, utf } = req.body;
  if (!userId || !amount || !utf) {
    res.status(400).send({ message: "User ID, amount and UTF are required!" });
    return;
  }
  Payments.create({
    amount,
    paymentDate: new Date(),
    utf,
    user_id: userId,
  })
    .then((payment) => {
      res
        .status(201)
        .send({ message: "Payment created successfully", data: payment });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message, data: req.body });
    });
};

exports.getPendingPayments = (req, res) => {
  Payments.findAll({
    where: {
      status: "pending",
    },
  })
    .then((payments) => {
      res.send(payments);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getUserPayments = (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    res.status(400).send({ message: "User ID is required!" });
    return;
  }
  Payments.findAll({
    where: {
      user_id: userId,
    },
  })
    .then((payments) => {
      res.send(payments);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.updatePayment = async (req, res) => {
  const { paymentId } = req.params;
  if (!paymentId) {
    res.status(400).send({ message: "Payment ID is required!" });
    return;
  }

  try {
    const payment = await Payments.findByPk(paymentId);
    if (!payment) {
      res
        .status(404)
        .send({ message: `Payment with id=${paymentId} not found` });
      return;
    }

    if (payment.status === "approved") {
      res.send({ message: `Payment with id=${paymentId}, already approved` });
      return;
    }
    payment.status = "approved";
    const user = await db.user.findByPk(payment.user_id);
    const portfolio = await db.portfolio.findByPk(user.portfolio_id, {
      attributes: ["id", "wallet_amount"],
    });
    if (!portfolio) {
      res.status(404).send({ message: "Portfolio not found" });
      return;
    }
    portfolio.wallet_amount += payment.amount;
    await payment.save();
    await portfolio.save();
    res.send({ message: "Payment updated successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
