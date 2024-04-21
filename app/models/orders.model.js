const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Order = sequelize.define(
    "Order",
    {
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "diamonds",
          key: "id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      tableName: "orders",
      timestamps: true,
    }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "users",
    });
    Order.belongsTo(Diamond, {
      foreignKey: "product_id",
      as: "diamonds",
    });
  };

  // Order.sync({ force: true });

  return Order;
};
