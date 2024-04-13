const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const BankDetails = sequelize.define(
    "bank_details",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      branchName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ifscCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accountHolderName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "bank_details", // Specify the table name
      timestamps: true, // Include createdAt and updatedAt columns
    }
  );

  return BankDetails;
};
