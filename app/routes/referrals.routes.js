const controller = require("../controllers/referrals.controller");

module.exports = function (app) {
  app.get("/api/referral/:userId", controller.getUserReferral);
  // app.post("/api/referral/create", controller.createReferral);
  // app.post("/api/referral/use", controller.useReferral);
  // app.post("/api/referral/add-benefit", controller.addBenefit);
};
