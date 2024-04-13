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
      },
      productIds: {
        type: Sequelize.STRING,
        allowNull: false,
        get: function () {
          return JSON.parse(this.getDataValue("productIds"));
        },
        set: function (val) {
          return this.setDataValue("productIds", JSON.stringify(val));
        },
      },
    },
    {
      tableName: "portfolio",
      timestamps: true,
    }
  );

  return Portfolio;
};
