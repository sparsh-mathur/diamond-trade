const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Referrals = sequelize.define("referrals", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    referralCode: {
      type: DataTypes.STRING,
    },
  });

  return Referrals;
};
