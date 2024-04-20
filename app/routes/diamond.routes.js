const controller = require("../controllers/diamond.controller");
const uploadImage = require("../middlewares/uploadImage.middleware");

module.exports = function (app) {
  app.get("/api/diamonds", controller.getAllDiamonds);
  app.post(
    "/api/diamond",
    uploadImage.single("image"),
    controller.createDiamond
  );
  app.delete("/api/diamond/:diamondId", controller.deleteDiamond);
  app.put("/api/diamond/:diamondId", controller.editDiamond);
  app.get("/api/diamond/trends", controller.getTrendingDiamonds);
  app.get("/api/diamond/price-history/:diamondId", controller.getPriceHistory);
};
