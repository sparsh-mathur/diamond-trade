const { orders: Orders, portfolio: Portfolio } = require("../models");

exports.postOrder = async (req, res) => {
  const { userId, productId, quantity, type, totalPrice } = req.body;
  if (!userId || !productId || !quantity || !type || !totalPrice) {
    res.status(400).send({ message: "All fields are required" });
    return;
  }
  try {
    const order = await Orders.create({
      customerId: userId,
      productId,
      quantity,
      type,
      status: type === "buy" ? "approved" : "pending",
      totalPrice,
    });

    if (order.type === "buy") {
      const userPortfolio = await Portfolio.findOne({
        where: {
          userId: order.customerId,
        },
      });
      let products = JSON.parse(userPortfolio.products);
      products = [
        ...products,
        {
          productId: order.productId,
          quantity: order.quantity,
          buyPrice: order.totalPrice,
        },
      ];
      userPortfolio.products = JSON.stringify(products);
      userPortfolio.save();
      res.send({
        message: "order has been created, and your portfolio updated",
        data: order,
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
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
      res.send({ message: "Order has been approved!", data: order });
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
      res.send({ message: "Order has been rejected!", data: order });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
