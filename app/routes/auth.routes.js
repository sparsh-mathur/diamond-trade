const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const MediaController = require("../controllers/media.controller");

module.exports = function (app) {
  app.post(
    "/api/auth/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    [uploadImage.single("image"), MediaController.saveMedia],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
};
