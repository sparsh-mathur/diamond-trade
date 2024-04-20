const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Media = sequelize.define(
    "media",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("image", "video"),
        allowNull: false,
        defaultValue: "image",
      },
    },
    {
      tableName: "media",
      timestamps: true,
      updatedAt: false,
    }
  );

  // Media.sync({ force: true });
  return Media;
};
