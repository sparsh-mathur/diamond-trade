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
