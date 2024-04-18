const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const News = sequelize.define(
    "news",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      author_id: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
      image_id: {
        type: DataTypes.UUID,
        references: {
          model: "media",
          key: "id",
        },
      },
    },
    {
      tableName: "news",
      timestamps: true,
    }
  );

  return News;
};
