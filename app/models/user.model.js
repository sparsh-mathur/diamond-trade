const { DataTypes, models } = require("sequelize");
const { portfolio } = require(".");

module.exports = (sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
      allowNull: false,
    },
    portfolio_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "portfolio",
        key: "id",
      },
    },
    referralCode: {
      type: DataTypes.STRING,
    },
  });

  return User;
};
