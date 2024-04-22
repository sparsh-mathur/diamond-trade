const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.get("/api/users/all", controller.getAllUsers);
  app.get("/api/users/info/:userId", controller.getUserInfo);
  app.delete("/api/users/:userId", controller.deleteUser);
  app.get("/api/admins/all", controller.getAllAdmins);
};
