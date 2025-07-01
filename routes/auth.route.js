const { Router } = require("express");
const {
  signIn,
  signUp,
  forgetPassword,
  resetPassword,
} = require("../controllers/auth.controller");
require("dotenv").config();

const authRouter = Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.post("/forget-password", forgetPassword);
authRouter.post("/reset-password", resetPassword);
module.exports = authRouter;
