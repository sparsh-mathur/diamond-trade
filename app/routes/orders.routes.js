const controller = require("../controllers/orders.controller");

module.exports = function (app) {
  app.post("/api/order", controller.postOrder);
  app.get("/api/order/pending", controller.getAllPendingOrders);
  app.put("/api/order/confirm/:orderId", controller.confirmOrder);
  app.put("/api/order/reject/:orderId", controller.rejectOrder);
};
