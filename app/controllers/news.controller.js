const db = require("../models");
const News = db.news;

exports.getAllNews = (req, res) => {
  News.findAll({
    order: [["publishedAt", "DESC"]],
  })
    .then((news) => {
      res.send(news);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.createNews = (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400).send({ message: "Title and content are required!" });
    return;
  }
  News.create({
    title,
    content,
    author: req.userId || "admin",
    publishedAt: new Date(),
  })
    .then((news) => {
      res
        .status(201)
        .send({ message: "news created successfully", data: news });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
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
      publishedAt: new Date(),
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
