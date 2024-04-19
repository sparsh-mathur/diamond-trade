const { authJwt } = require("../middleware");
const controller = require("../controllers/news.controller");
const MediaController = require("../controllers/media.controller");
const uploadImage = require("../middlewares/uploadImage.middleware");

module.exports = function (app) {
  app.get("/api/news", controller.getAllNews);
  app.post(
    "/api/news",
    // [authJwt.impersonateAdmin],
    // [uploadImage.single("image"), MediaController.saveMedia],
    controller.createNews
  );
  app.put("/api/news/:newsId", controller.editNews);
  app.delete("/api/news/:newsId", controller.deleteNews);
};
