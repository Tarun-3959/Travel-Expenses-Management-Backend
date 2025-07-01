const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL, // generated ethereal user
    pass: process.env.EMAIL_PASSWORD,
  },
});

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res
        .status(406)
        .json({ errorMessage: "Please provide name, email and password" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    let user = await userModel.create({ name, email, password: hash });
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRETE_KEY,
      { expiresIn: "7d" }
    );
    res.status(201).json({
      message: `User signed up successfully`,
      user: { userId: user._id, name, email },
      token,
    });
  } catch (error) {
    if (error.errorResponse && error.errorResponse.code == 11000) {
      return res.status(400).json({ errorMessage: "Email is already present" });
    }
    if (error._message == "User validation failed") {
      return res
        .status(406)
        .json({ errorMessage: "please provide required data or correct data" });
    }
    console.log("Error occured during sing up\n", error);
    res
      .status(500)
      .json({ errorMessage: "Something went wrong, please try again" });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ errorMessage: "please provide email and password both" });
    }
    let user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ errorMessage: "Invalid Email or Password!!" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res
        .status(400)
        .json({ errorMessage: "Invalid Email or Password!!" });
    }
    let token = jwt.sign(
      { id: user._id, email, name: user.name, role: user.role },
      process.env.ACCESS_TOKEN_SECRETE_KEY,
      {
        expiresIn: "7d",
      }
    );
    console.log("created Token:\n", token, token.length);
    res.status(200).json({
      message: `User logged in successfully`,
      user: { userId: user._id, email, name: user.name },
      token,
    });
  } catch (error) {
    console.log("Error occured during sign in\n", error);
    res
      .status(500)
      .json({ errorMessage: "Something went wrong, please try again" });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ errorMessage: "Please provide email" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ errorMessage: "User not found" });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save code and expiry to DB
    user.otpCode = code;
    user.otpExpiry = expiry;
    await user.save();

    // Send email
    await transporter.sendMail({
      from: '"Tarun kushwaha"',
      to: email,
      subject: "Your password reset code",
      text: `Use this code to reset your password: ${code}\nThis code is valid for 10 minutes.`,
    });

    console.log("OTP sent to email:", email);
    res.status(200).json({ message: "OTP sent to your email address" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res
      .status(500)
      .json({ errorMessage: "Something went wrong, please try again" });
  }
};

const resetPassword = async (req, res) => {
  const { email, code, password } = req.body;
  if (!email || !code || !password) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide email, code, and password" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user || user.otpCode !== code || new Date() > user.otpExpiry) {
      return res.status(403).json({ errorMessage: "Invalid or expired code" });
    }

    // Hash new password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Update password and clear OTP
    user.password = hash;
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res
      .status(500)
      .json({ errorMessage: "Something went wrong, please try again" });
  }
};

module.exports = { signUp, signIn, forgetPassword, resetPassword };
