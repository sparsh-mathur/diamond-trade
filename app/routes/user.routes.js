const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const MediaController = require("../controllers/media.controller");
const uploadImage = require("../middlewares/uploadImage.middleware");

module.exports = function (app) {
  app.get("/api/users/all", controller.getAllUsers);
  app.get("/api/users/info/:userId", controller.getUserInfo);
  app.put(
    "/api/users/info/:userId",
    [uploadImage.single("image"), MediaController.saveMedia],
    controller.updateUserInfo
  );
  app.delete("/api/users/:userId", controller.deleteUser);
  app.get("/api/admins/all", controller.getAllAdmins);
};
