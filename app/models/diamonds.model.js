module.exports = (sequelize, Sequelize) => {
  const Diamonds = sequelize.define("diamonds", {
    name: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.INTEGER,
    },
    category: {
      type: Sequelize.STRING,
    },
    subcategory: {
      type: Sequelize.STRING,
    },
  });
  // Diamonds.sync({ alter: true }).then(() => {
  //   console.log("Diamonds Model synced");
  // });
  return Diamonds;
};
