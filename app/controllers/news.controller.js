const db = require("../models");
const News = db.news;
const Media = db.medias;

exports.getAllNews = (req, res) => {
  News.findAll({
    order: [["createdAt", "DESC"]],
  })
    .then((news) => {
      res.send(news);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.createNews = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400).send({ message: "Title ,content are required!" });
    return;
  }
  try {
    const createdNews = await News.create({
      title,
      content,
      author_id: req.userId,
      image_id: req.media_id,
    });

    res
      .status(201)
      .send({ message: "news created successfully", data: createdNews });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.editNews = (req, res) => {
  const { title, content } = req.body;
  const { newsId } = req.params;
  if (!title || !content) {
    res.status(400).send({ message: "Title and content are required!" });
    return;
  }

  News.update(
    {
      title,
      content,
      author: req.userId || "admin",
    },
    {
      where: {
        id: newsId,
      },
    }
  )
    .then((news) => {
      res.send({ message: "news updated successfully", data: news });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.deleteNews = (req, res) => {
  const { newsId } = req.params;
  if (!newsId) {
    res.status(400).send({ message: "newsId is required!" });
    return;
  }
  News.destroy({
    where: {
      id: newsId,
    },
  })
    .then(() => {
      res.send({ message: "news deleted successfully" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
