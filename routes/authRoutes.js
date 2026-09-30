const express = require("express");
const authRoutes = express.Router();
const User = require("../models/User");
const {
  getLogin,
  Login,
  getRegister,
  Register,
  Logout,
} = require("../controllers/authController");

authRoutes.get("/login", getLogin);
// login logic
authRoutes.post("/login", Login);

authRoutes.get("/register", getRegister);
// register logic
authRoutes.post("/register", Register);

authRoutes.get("/logout", Logout);

module.exports = authRoutes;
