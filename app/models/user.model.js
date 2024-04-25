const { DataTypes } = require("sequelize");

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
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
    portfolio_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "portfolio",
        key: "id",
      },
    },
    image_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "media",
        key: "id",
      },
    },
    referral_code: {
      type: DataTypes.STRING,
    },
  });

  User.sync({ alter: true });

  return User;
};
