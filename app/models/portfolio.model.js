module.exports = (sequelize, Sequelize) => {
  const Portfolio = sequelize.define(
    "portfolio",
    {
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      walletAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        default: 0.0,
      },
      products: {
        type: Sequelize.STRING,
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
