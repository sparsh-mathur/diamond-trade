const { sendOTPEmail } = require("../utils/nodemailer.js");
const otpGenerator = require("otp-generator");

const Users = require("../models").user;
const Media = require("../models").medias;
var bcrypt = require("bcryptjs");

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
exports.updateUserInfo = async (req, res) => {
  const { userId } = req.params;
  const { username, phone, email } = req.body;
  if (!userId) {
    res.status(400).send({ message: "User ID is required!" });
    return;
  }
  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      res.status(404).send({ message: `User with ID ${userId} not found` });
      return;
    }
    user.username = username;
    user.phone = phone;
    user.email = email;
    if (req.media_id) {
      user.image_id = req.media_id;
    }
    await user.save();
    res.send({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.updateUserPassword = async (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;
  if (!userId) {
    res.status(400).send({ message: "User ID is required!" });
    return;
  }
  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      res.status(404).send({ message: `User with ID ${userId} not found` });
      return;
    }
    user.password = bcrypt.hashSync(password, 8);
    await user.save();
    res.send({ message: "User password updated successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
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

exports.sendEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).send({ message: "Email is required!" });
    return;
  }
  const otp = otpGenerator.generate(4, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  await sendOTPEmail(otp, email);
  res.send({ message: `OTP sent successfully to ${email}`, otp });
};
