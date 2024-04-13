const controller = require("../controllers/referrals.controller");

module.exports = function (app) {
  app.post("/api/referral/create", controller.createReferral);
  app.post("/api/referral/use", controller.useReferral);
};
