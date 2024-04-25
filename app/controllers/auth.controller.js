const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Portfolio = db.portfolio;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .send({ message: "username, email and password are required fields" });
    }

    const user = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 8),
      image_id: req.media_id,
      phone,
    });
    if (!user) {
      return res.status(500).send({ message: "User creation failed" });
    }
    const portfolio = await Portfolio.create(
      {},
      {
        returning: false,
      }
    );
    if (!portfolio) {
      return res.status(500).send({ message: "Portfolio creation failed" });
    }
    user.portfolio_id = portfolio.id;
    await user.save();
    res.status(200).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: "Email or Password is missing" });
  }
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }
    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    });

    res.status(200).send({
      message: "User logged in successfully",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        accessToken: token,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
