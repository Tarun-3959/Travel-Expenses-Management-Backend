const jwt = require("jsonwebtoken");
const userPowers = require("../utils");
const tripModel = require("../models/trip.model");
require("dotenv").config();
const tokenValidationMW = (req, res, next) => {
  try {
    let token = req.headers?.authorization?.split(" ")[1];
    console.log("token gotted:\n", token);
    if (!token) {
      return res.status(400).json({ errorMessage: "Please provide token" });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE_KEY, (err, decoded) => {
      if (err) {
        console.log(
          "error is occured in jwt verify function while validating the token\n",
          err
        );
        res.status(400).json({ errorMessage: "Invalid or expired token" });
      } else {
        req.user = decoded;
        next();
      }
    });
  } catch (error) {
    console.log("Error occured durning validating the token\n", error);
    res
      .status(500)
      .json({ errorMessage: "Something went wrong, please try again" });
  }
};

const verifyRoleMW = (role) => {
  return (req, res, next) => {
    try {
      console.log(
        "user role: ",
        req.user.role,
        "user powers: ",
        userPowers[req.user.role]
      );
      console.log(
        "required role: ",
        role,
        "required powers:",
        userPowers[role]
      );
      if (userPowers[req.user.role] >= userPowers[role]) next();
      else
        return res.status(400).json({
          message: "Invalid credentials, you can't access this route",
        });
    } catch (error) {
      console.log(
        "error occured durning checking role of admin in middleware\n",
        error
      );
      return res.status(500).json({
        message: "Internal server error, please try again",
      });
    }
  };
};

const verifyTripOwnershipMW = async (req, res, next) => {
  try {
    const trip = await tripModel.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!trip)
      return res.status(404).json({ errorMessage: "Trip not found in mv" });
    next();
  } catch (error) {
    console.log("error in varify trip owner middelware:", error);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
};

module.exports = { tokenValidationMW, verifyRoleMW, verifyTripOwnershipMW };
