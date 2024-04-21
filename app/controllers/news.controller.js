const db = require("../models");
const News = db.news;
const Media = db.medias;

exports.getAllNews = async (req, res) => {
  try {
    const news = await News.findAll({
      order: [["createdAt", "DESC"]],
    });

    const imageIds = news.reduce((acc, curr) => {
      if (curr.image_id) acc.push(curr.image_id);
      return acc;
    }, []);

    const images = await Media.findAll({
      where: {
        id: imageIds,
      },
    });
    news.forEach((news) => {
      if (news.image_id) {
        const image = images.find((image) => image.id === news.image_id);
        news.dataValues.image = image.toJSON();
      }
    });
    res.send(news);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.createNews = async (req, res) => {
  const { title, content, userId } = req.body;
  if (!title || !content) {
    res.status(400).send({ message: "Title ,content are required!" });
    return;
  }
  try {
    const createdNews = await News.create({
      title,
      content,
      author_id: userId,
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
  const { title, content, userId } = req.body;
  const { newsId } = req.params;
  if (!title || !content | !userId) {
    res.status(400).send({ message: "Title,content and userId are required!" });
    return;
  }

  News.update(
    {
      title,
      content,
      author_id: userId,
    },
    {
      where: {
        id: newsId,
      },
    }
  )
    .then((news) => {
      res
        .status(200)
        .send({ message: "news updated successfully", data: news });
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
