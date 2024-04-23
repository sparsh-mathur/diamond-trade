const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const BankDetails = sequelize.define(
    "bank_details",
    {
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        unique: true,
      },
      account_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      branch_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ifsc_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      account_holder_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "bank_details",
      timestamps: true,
    }
  );

  BankDetails.associate = (models) => {
    BankDetails.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "users",
    });
  };

  // BankDetails.sync({ force: true });

  return BankDetails;
};
