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

db.user = require("../models/user.model.js")(sequelize, Sequelize);

db.diamonds = require("../models/diamonds.model.js")(sequelize, Sequelize);
db.orders = require("../models/orders.model.js")(sequelize, Sequelize);
db.news = require("../models/news.model.js")(sequelize, Sequelize);
db.referrals = require("../models/referrals.model.js")(sequelize, Sequelize);
// db.referrals = require("../models/portfolio.model.js")(sequelize, Sequelize);

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
