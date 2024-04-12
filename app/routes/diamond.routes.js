const { authJwt } = require("../middleware");
const controller = require("../controllers/diamond.controller");

module.exports = function (app) {
  app.get("/api/diamonds", controller.getAllDiamonds);
  app.post("/api/diamond", controller.createDiamond);
  app.delete("/api/diamond/:diamondId", controller.deleteDiamond);
  app.put("/api/diamond/:diamondId", controller.editDiamond);
};
