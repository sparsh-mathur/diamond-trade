const nodemailer = require("nodemailer");
const { OTP_template } = require("../templates/sendingOTP");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.email,
    pass: process.env.pass,
  },
});

// async..await is not allowed in global scope, must use a wrapper
const sendOTPEmail = async (otp, email) => {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Diamond mall 👻"', // sender address
    to: email, // list of receivers
    subject: "Email Verification - Diamond Mall", // Subject line
    text: `OTP : ${otp}`, // plain text body
    html: OTP_template(otp), // html body
  });

  console.log("Message sent: %s", info.messageId);
};
module.exports = { sendOTPEmail };
