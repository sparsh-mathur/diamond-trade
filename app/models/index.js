const config = require("../config/db.config.ts");

const Sequelize = require("sequelize");

const sequelize = config.CLOUD_CONNECTION_STRING
  ? new Sequelize(config.CLOUD_CONNECTION_STRING)
  : new Sequelize(config.DB, config.USER, config.PASSWORD, {
      host: config.HOST,
      dialect: config.dialect,
      pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle,
      },
    });
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.portfolio = require("../models/portfolio.model.js")(sequelize);
db.user = require("../models/user.model.js")(sequelize);
db.medias = require("../models/media.model.js")(sequelize);
db.diamonds = require("../models/diamonds.model.js")(sequelize);
db.product_price_change = require("../models/product_price_change.model.js")(
  sequelize
);
db.orders = require("../models/orders.model.js")(sequelize);
db.news = require("../models/news.model.js")(sequelize);
db.bank_details = require("../models/bank_details.js")(sequelize);
db.payments = require("../models/payments.model.js")(sequelize);
db.portfolio_products = require("../models/portfolio_products.model.js")(
  sequelize
);
db.referrals = require("../models/referrals.model.js")(sequelize);

// associations
db.user.hasOne(db.portfolio, {
  foreignKey: "user_id",
});
db.portfolio.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
});

db.user.hasMany(db.orders, {
  foreignKey: "user_id",
});
db.orders.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
});

//export
module.exports = db;
