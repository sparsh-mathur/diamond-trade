module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define(
    "Order",
    {
      customerId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      productId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      totalPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      tableName: "orders",
      timestamps: true,
    }
  );

  return Order;
};
