const { authJwt } = require("../middleware");
const controller = require("../controllers/diamond.controller");

module.exports = function (app) {
  app.get("/api/diamonds", controller.getAllDiamonds);

  app.post("/api/diamond", [], controller.createDiamond);
};
