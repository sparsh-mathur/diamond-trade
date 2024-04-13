const controller = require("../controllers/bankDetails.controller");

module.exports = function (app) {
  app.post("/api/bank/:userId", controller.addBankDetails);
};
