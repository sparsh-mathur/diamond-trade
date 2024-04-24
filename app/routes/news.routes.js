const { authJwt } = require("../middleware");
const controller = require("../controllers/news.controller");
const MediaController = require("../controllers/media.controller");
const uploadImage = require("../middlewares/uploadImage.middleware");

module.exports = function (app) {
  app.get("/api/news", controller.getAllNews);
  app.post(
    "/api/news",
    // [authJwt.impersonateAdmin],
    [uploadImage.single("image"), MediaController.saveMedia],
    controller.createNews
  );
  app.put(
    "/api/news/:newsId",
    [uploadImage.single("image"), MediaController.saveMedia],
    controller.editNews
  );
  app.delete("/api/news/:newsId", controller.deleteNews);

  app.post("/api/upload", uploadImage.single("image"), async (req, res) => {
    console.log("first", req.file);
    res.send({ message: "Successfully uploaded", data: req.file });
  });
};
