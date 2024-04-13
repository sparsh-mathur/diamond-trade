const controller = require("../controllers/portfolio.controller");

module.exports = function (app) {
  app.get("/api/portfolio/:userId", controller.getPortfolio);
  app.put("/api/portfolio/addMoney/:userId", controller.addMoney);
};
