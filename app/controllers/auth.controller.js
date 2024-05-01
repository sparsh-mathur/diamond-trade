const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Portfolio = db.portfolio;
require("dotenv").config();

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const { username, email, password, phone, referral_code } = req.body;

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
      referral_code,
    });
    if (!user) {
      return res.status(500).send({ message: "User creation failed" });
    }
    if (referral_code) {
      const referrer = await db.referrals.findOne({
        where: {
          referral_code,
        },
      });
      if (!referrer) {
        return res.status(404).send({ message: "Referrer not found" });
      }
      const referrer_id = referrer.user_id;
      const referrer_user = await User.findByPk(referrer_id);
      if (!referrer_user) {
        return res.status(404).send({ message: "Referrer not found" });
      }
      const referrer_portfolio = await Portfolio.findByPk(
        referrer_user.portfolio_id,
        {
          attributes: ["id", "wallet_amount"],
        }
      );
      if (!referrer_portfolio) {
        return res
          .status(404)
          .send({ message: "Referrer portfolio not found" });
      }
      referrer_portfolio.wallet_amount += process.env.REFERRER_AMOUNT;
      await referrer_portfolio.save();
    }

    const portfolio = await Portfolio.create(
      {
        wallet_amount: referral_code ? process.env.REFEREE_AMOUNT : 0,
      },
      {
        returning: false,
      }
    );
    if (!portfolio) {
      return res.status(500).send({ message: "Portfolio creation failed" });
    }
    user.portfolio_id = portfolio.id;
    await db.referrals.create({
      user_id: user.id,
      referral_code: user.id.toString().slice(0, 6),
    });
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
