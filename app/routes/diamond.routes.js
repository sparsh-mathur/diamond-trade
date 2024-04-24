const controller = require("../controllers/diamond.controller");
const MediaController = require("../controllers/media.controller");
const uploadImage = require("../middlewares/uploadImage.middleware");

module.exports = function (app) {
  app.get("/api/diamonds", controller.getAllDiamonds);
  app.post(
    "/api/diamond",
    [uploadImage.single("image"), MediaController.saveMedia],
    controller.createDiamond
  );
  app.delete("/api/diamond/:diamondId", controller.deleteDiamond);
  app.put(
    "/api/diamond/:diamondId",
    [uploadImage.single("image"), MediaController.saveMedia],
    controller.editDiamond
  );
  app.get("/api/diamond/trends", controller.getTrendingDiamonds);
  app.get("/api/diamond/price-history/:diamondId", controller.getPriceHistory);
};
