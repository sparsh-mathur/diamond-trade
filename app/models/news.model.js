module.exports = (sequelize, Sequelize) => {
  const News = sequelize.define(
    "news",
    {
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      publishedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "news",
      timestamps: true,
    }
  );

  return News;
};