module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define(
    "Order",
    {
      customerName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      productName: {
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
    },
    {
      tableName: "orders",
      timestamps: true,
    }
  );

  return Order;
};
