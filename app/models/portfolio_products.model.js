const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PortfolioProducts = sequelize.define(
    "portfolio_products",
    {
      portfolio_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "portfolio",
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
      buy_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "portfolio_products",
      timestamps: true,
    }
  );

  PortfolioProducts.associate = (models) => {
    PortfolioProducts.belongsTo(models.Portfolio, {
      foreignKey: "portfolio_id",
      as: "portfolio",
    });
    PortfolioProducts.belongsTo(models.Diamonds, {
      foreignKey: "product_id",
      as: "product",
    });
  };

  // PortfolioProducts.sync({ alter: true });
  return PortfolioProducts;
};
