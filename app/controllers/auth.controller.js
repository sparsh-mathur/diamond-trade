const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Portfolio = db.portfolio;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then(async (user) => {
      Portfolio.create({
        userId: user.id,
        walletAmount: 0,
        products: "[]",
      })
        .then((portfolio) => {
          console.log("portfolio created");
          res.status(201).send({
            message: "User registered successfully!",
            data: { ...user.dataValues, portfolio },
          });
        })
        .catch((err) => {
          console.log("error is creating portfolio", err);
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      console.log("error is creating user", err);
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: "Email or Password is missing" });
  }
  User.findOne({
    where: {
      email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(password, user.password);

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
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
