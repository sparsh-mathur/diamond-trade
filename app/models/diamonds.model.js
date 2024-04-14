module.exports = (sequelize, Sequelize) => {
  const Diamonds = sequelize.define("diamonds", {
    name: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.INTEGER,
    },
    oldPrice: {
      type: Sequelize.INTEGER,
    },
    category: {
      type: Sequelize.STRING,
    },
    subcategory: {
      type: Sequelize.STRING,
    },
  });
  return Diamonds;
};
