const controller = require("../controllers/payments.controller");

module.exports = function (app) {
  app.post("/api/payment", controller.postPayment);
  app.get("/api/payment/pending", controller.getPendingPayments);
  app.get("/api/payment/:userId", controller.getUserPayments);
  app.put("/api/payment/:paymentId", controller.updatePayment);
};
