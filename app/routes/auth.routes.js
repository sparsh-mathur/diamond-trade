const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const MediaController = require("../controllers/media.controller");
const uploadImage = require("../middlewares/uploadImage.middleware");

module.exports = function (app) {
  app.post(
    "/api/auth/signup",
    [uploadImage.single("image"), MediaController.saveMedia],
    [verifySignUp.checkDuplicateUsernameOrEmail],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
};
