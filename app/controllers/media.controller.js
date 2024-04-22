const Media = require("../models").medias;

exports.saveMedia = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const image = await Media.create({
    url: req.file.location,
    type: "image",
  });
  req.media_id = image.id || null;
  return next();
};

exports.addPaymentImage = async (req, res, next) => {
  if (!req.file) {
    res.status(400).send({ message: "Please upload an image" });
    return;
  }
  const paymentImage = await Media.findOne({
    where: {
      type: "payment",
    },
  });
  if (paymentImage) {
    await paymentImage.update({
      url: req.file.location,
    });
    res.send({ message: "payment image updated successfully" });
    return;
  }
  await Media.create({
    url: req.file.location,
    type: "payment",
  });
  res.send({ message: "payment image uploaded successfully" });
};

exports.getPaymentImage = async (_, res, next) => {
  try {
    const paymentImage = await Media.findOne({
      where: {
        type: "payment",
      },
    });
    if (!paymentImage) {
      res.status(404).send({ message: "No payment image found" });
      return;
    }
    res.send(paymentImage.url);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.addCarouselImage = async (req, res) => {
  if (!req.file) {
    res.status(400).send({ message: "Please upload an image" });
    return;
  }
  await Media.create({
    url: req.file.location,
    type: "carousel",
  });
  res.send({ message: "carousel image uploaded successfully" });
};

exports.deleteCarouselImage = async (req, res) => {
  const { imageId } = req.params;
  if (!imageId) {
    res.status(400).send({ message: "Please provide an image id" });
    return;
  }
  try {
    await Media.destroy({
      where: {
        id: imageId,
        type: "carousel",
      },
    });
    res.send({ message: "carousel image deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getCarouselImages = async (_, res) => {
  try {
    const carouselImages = await Media.findAll({
      where: {
        type: "carousel",
      },
      attributes: ["url"],
    });
    if (!carouselImages) {
      res.status(404).send({ message: "No carousel images found" });
      return;
    }
    const imageUrls = carouselImages.map((image) => image.url);
    res.send(imageUrls);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
