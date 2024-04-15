module.exports = (sequelize, Sequelize) => {
  const Payments = sequelize.define(
    "payments",
    {
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      paymentDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      utf: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      tableName: "payments",
      timestamps: true,
    }
  );

  return Payments;
};
