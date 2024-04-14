const { orders: Orders, portfolio: Portfolio } = require("../models");

exports.postOrder = (req, res) => {
  const { userId, productId, quantity, type, totalPrice } = req.body;
  if (!userId || !productId || !quantity || !type || !totalPrice) {
    res.status(400).send({ message: "All fields are required" });
    return;
  }

  Orders.create({
    customerId: userId,
    productId,
    quantity,
    type,
    totalPrice,
  })
    .then(async (order) => {
      if (order.type === "buy") {
        const userPortfolio = await Portfolio.findOne({
          where: {
            userId: order.customerId,
          },
        });
        let productIds = JSON.parse(userPortfolio.productIds);
        productIds = [
          ...productIds,
          {
            productId: order.productId,
            quantity: order.quantity,
            buyPrice: order.totalPrice,
          },
        ];
        userPortfolio.productIds = JSON.stringify(productIds);
        userPortfolio.save();
      }
      res.send(order);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getAllPendingOrders = (req, res) => {
  Orders.findAll({ where: { status: "pending" } })
    .then((orders) => {
      res.send(orders);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.confirmOrder = (req, res) => {
  const { orderId } = req.params;
  if (!orderId) {
    res.status(400).send({ message: "Order ID is required" });
    return;
  }
  Orders.update({ status: "approved" }, { where: { id: orderId } })
    .then((order) => {
      res.send(order);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.rejectOrder = (req, res) => {
  const { orderId } = req.params;
  if (!orderId) {
    res.status(400).send({ message: "Order ID is required" });
    return;
  }
  Orders.update({ status: "rejected" }, { where: { id: orderId } })
    .then((order) => {
      res.send(order);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
