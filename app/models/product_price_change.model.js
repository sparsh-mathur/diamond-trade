const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Product_price_change = sequelize.define(
    "product_price_change",
    {
      product_id: {
        type: DataTypes.UUID,
        references: {
          model: "diamonds",
          key: "id",
        },
        allowNull: false,
      },
      new_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      tableName: "product_price_change",
      timestamps: true,
      updatedAt: false,
    }
  );
  Product_price_change.associate = (models) => {
    Product_price_change.belongsTo(models.Diamond, {
      foreignKey: "product_id",
      as: "diamonds",
    });
  };
  // Product_price_change.sync({ force: true });

  return Product_price_change;
};
