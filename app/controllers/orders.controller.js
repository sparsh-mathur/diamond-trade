const { Op } = require("sequelize");
const {
  orders: Orders,
  portfolio: Portfolio,
  user: User,
  portfolio_products,
  diamonds: Diamonds,
} = require("../models");

exports.postOrder = async (req, res) => {
  const { userId, product_id, quantity, type, total_price } = req.body;
  if (!userId || !product_id || !quantity || !type || !total_price) {
    res.status(400).send({ message: "All fields are required" });
    return;
  }
  try {
    const order = await Orders.create({
      user_id: userId,
      product_id,
      quantity,
      type,
      status: type === "buy" ? "approved" : "pending",
      total_price,
    });

    if (order.type === "buy") {
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).send({ message: "User not found" });
        return;
      }
      const userPortfolio = await Portfolio.findByPk(user.portfolio_id, {
        attributes: ["id", "wallet_amount"],
      });
      if (!userPortfolio) {
        res.status(404).send({ message: "User portfolio not found" });
        return;
      }

      if (userPortfolio.wallet_amount < order.total_price) {
        res.status(400).send({ message: "Insufficient funds" });
        return;
      }
      const productInPortfolio = await portfolio_products.findOne({
        where: {
          portfolio_id: userPortfolio.id,
          product_id,
        },
      });
      if (!productInPortfolio) {
        await portfolio_products.create({
          portfolio_id: userPortfolio.id,
          product_id,
          quantity,
          buy_price: total_price,
        });
      } else {
        productInPortfolio.quantity += quantity;
        productInPortfolio.buy_price += total_price;
        await productInPortfolio.save();
      }

      userPortfolio.wallet_amount -= order.total_price;
      await userPortfolio.save();
      res.send({
        message: "order successfully completed, and your portfolio updated",
      });
      return;
    }
    res.send({
      message: "order has been created, will be approved by admin",
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
      user_id: userId,
    },
    order: [["createdAt", "DESC"]],
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
    if (order.type !== "sell") {
      res.send({ message: "Admin can only approve sell orders", data: order });
      return;
    }
    const user = await User.findByPk(order.user_id);
    const userPortfolio = await Portfolio.findByPk(user.portfolio_id, {
      attributes: ["id", "wallet_amount"],
    });
    if (!userPortfolio) {
      res.status(404).send({ message: "User portfolio not found" });
      return;
    }
    const productInPortfolio = await portfolio_products.findOne({
      where: {
        portfolio_id: userPortfolio.id,
        product_id: order.product_id,
      },
    });
    if (!productInPortfolio) {
      res.status(404).send({ message: "Product not found in user portfolio" });
      return;
    }
    if (productInPortfolio.quantity < order.quantity) {
      res.status(400).send({ message: "Insufficient product quantity" });
      return;
    }
    productInPortfolio.quantity -= order.quantity;
    productInPortfolio.buy_price -= order.total_price;
    userPortfolio.wallet_amount += order.total_price;
    if (productInPortfolio.quantity === 0) {
      await productInPortfolio.destroy();
    } else {
      await productInPortfolio.save();
    }
    await order.save();
    await userPortfolio.save();
    res.send({ message: "Order has been approved!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
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
