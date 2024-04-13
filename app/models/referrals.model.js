module.exports = (sequelize, Sequelize) => {
  const Referrals = sequelize.define("referrals", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    referralCode: {
      type: Sequelize.STRING,
    },
    userId: {
      type: Sequelize.STRING,
    },
  });

  return Referrals;
};
