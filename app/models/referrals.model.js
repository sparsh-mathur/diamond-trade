const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Referrals = sequelize.define("referrals", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    referral_code: {
      type: DataTypes.STRING,
    },
  });
  // Referrals.sync({ force: true });

  return Referrals;
};
