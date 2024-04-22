const Users = require("../models").user;
const Media = require("../models").medias;

exports.getAllUsers = (req, res) => {
  Users.findAll({
    where: {
      role: "user",
    },
    attributes: {
      exclude: ["password"],
    },
  })
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getUserInfo = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    res.status(400).send({ message: "User ID is required!" });
    return;
  }
  try {
    const user = await Users.findByPk(userId, {
      attributes: {
        exclude: ["password"],
      },
    });
    if (!user) {
      res.status(404).send({ message: `User with ID ${userId} not found` });
    }
    const profile_image = await Media.findByPk(user.image_id);
    user.setDataValue("profile_image", profile_image);
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.deleteUser = (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    res.status(400).send({ message: "User ID is required!" });
    return;
  }
  Users.destroy({
    where: {
      id: userId,
    },
  })
    .then(() => {
      res.send({ message: "User deleted successfully" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getAllAdmins = (req, res) => {
  Users.findAll({
    where: {
      role: "admin",
    },
  })
    .then((admins) => {
      res.send(admins);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
