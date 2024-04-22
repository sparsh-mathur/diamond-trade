const MediaController = require("../controllers/media.controller");
const uploadImage = require("../middlewares/uploadImage.middleware");

module.exports = function (app) {
  app.post("/api/media/payment-image", [
    uploadImage.single("image"),
    MediaController.addPaymentImage,
  ]);
  app.get("/api/media/payment-image", MediaController.getPaymentImage);

  app.get("/api/media/carousel-image", MediaController.getCarouselImages);
  app.post("/api/media/carousel-image", [
    uploadImage.single("image"),
    MediaController.addCarouselImage,
  ]);
  app.delete(
    "/api/media/carousel-image/:imageId",
    MediaController.deleteCarouselImage
  );
};
