const Users = require("../models").user;

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
