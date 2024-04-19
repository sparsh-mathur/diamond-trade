const { Op } = require("sequelize");
const {
  orders: Orders,
  portfolio: Portfolio,
  user: User,
} = require("../models");

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
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).send({ message: "User not found" });
        return;
      }
      const userPortfolio = await Portfolio.findByPk(user.portfolio_id);
      if (!userPortfolio) {
        res.status(404).send({ message: "User portfolio not found" });
        return;
      }

      if (userPortfolio.walletAmount < order.totalPrice) {
        res.status(400).send({ message: "Insufficient funds" });
        return;
      }

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
      userPortfolio.walletAmount -= order.totalPrice;
      userPortfolio.save();
    }
    res.send({
      message: "order has been created, and your portfolio updated",
      data: order,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

exports.getAllPendingOrders = (req, res) => {
  Orders.findAll({
    where: {
      [Op.and]: [{ status: "pending" }, { type: "sell" }],
    },
  })
    .then((orders) => {
      res.send(orders);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getAllUserOrders = (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    res.status(400).send({ message: "User ID is required" });
    return;
  }
  Orders.findAll({
    where: {
      customerId: userId,
    },
  })
    .then((orders) => {
      res.send(orders);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.confirmOrder = async (req, res) => {
  const { orderId } = req.params;
  if (!orderId) {
    res.status(400).send({ message: "Order ID is required" });
    return;
  }
  try {
    const order = await Orders.findByPk(orderId);
    if (!order) {
      res.status(404).send({ message: "Order not found" });
      return;
    }
    order.status = "approved";
    order.save();
    if (order.type !== "sell") {
      res.send({ message: "Admin can only approve sell orders", data: order });
      return;
    }
    const userPortfolio = await Portfolio.findOne({
      where: {
        userId: order.customerId,
      },
    });
    if (!userPortfolio) {
      res.status(404).send({ message: "User portfolio not found" });
      return;
    }
    let products = JSON.parse(userPortfolio.products);
    const productIndex = products.findIndex(
      (product) => product.productId === order.productId
    );
    if (productIndex === -1) {
      res.status(404).send({ message: "Product not found in user portfolio" });
      return;
    }
    const product = products[productIndex];
    if (product.quantity < order.quantity) {
      res.status(400).send({ message: "Insufficient product quantity" });
      return;
    }
    product.quantity -= order.quantity;
    products[productIndex] = product;
    userPortfolio.products = JSON.stringify(products);
    userPortfolio.walletAmount += order.totalPrice;
    userPortfolio.save();
    res.send({ message: "Order has been approved!", data: order });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
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
