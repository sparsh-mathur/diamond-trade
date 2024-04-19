const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Portfolio = sequelize.define(
    "portfolio",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      walletAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        default: 0.0,
      },
      products: {
        type: DataTypes.STRING,
        allowNull: false,
        default: "[]",
      },
    },
    {
      tableName: "portfolio",
      timestamps: true,
    }
  );
  return Portfolio;
};
