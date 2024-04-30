const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Referrals = sequelize.define("referrals", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    referral_code: {
      type: DataTypes.STRING,
    },
  });
  // Referrals.sync({ alter: true });

  return Referrals;
};
