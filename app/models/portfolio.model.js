const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Portfolio = sequelize.define(
    "portfolio",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      wallet_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
    },
    {
      tableName: "portfolio",
      timestamps: true,
    }
  );

  // Portfolio.sync({ alter: true });
  return Portfolio;
};
