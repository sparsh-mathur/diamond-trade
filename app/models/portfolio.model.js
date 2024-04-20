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
        default: 0.0,
      },
    },
    {
      tableName: "portfolio",
      timestamps: true,
    }
  );

  // Portfolio.sync({ force: true });
  return Portfolio;
};
