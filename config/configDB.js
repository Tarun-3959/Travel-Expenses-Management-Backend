const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    console.log("DB is connecting, please wait...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB is connected!");
  } catch (error) {
    console.log("error while connection the DB\n", error);
  }
};

module.exports = connectDB;
