const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Diamonds = sequelize.define("diamonds", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    old_price: {
      type: DataTypes.INTEGER,
    },
    carat: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.STRING,
    },
    shape: {
      type: DataTypes.STRING,
    },
    color: {
      type: DataTypes.STRING,
    },
    manufacturing: {
      type: DataTypes.STRING,
    },
    image_id: {
      type: DataTypes.UUID,
      references: {
        model: "media",
        key: "id",
      },
    },
  });

  Diamonds.associate = (models) => {
    Diamonds.hasOne(models.Media, {
      foreignKey: "image_id",
      as: "image",
    });
  };

  // Diamonds.sync({ force: true });

  return Diamonds;
};
