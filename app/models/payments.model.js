const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Payments = sequelize.define(
    "payments",
    {
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      utf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      tableName: "payments",
      timestamps: true,
    }
  );
  Payments.associate = (models) => {
    Payments.belongsTo(models.user, {
      foreignKey: "user_id",
      as: "users",
    });
  };
  // Payments.sync({ force: true });

  return Payments;
};
