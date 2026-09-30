const express = require("express");
const User = require("../models/User");
const {
  getUserProfile,
  getEditProfileForm,
  updateUserProfile,
  deleteUserAccount,
} = require("../controllers/UserController");
const { ensureAuthenticated } = require("../middlewares/auth");
const upload = require("../config/multer");
const userRoutes = express.Router();

userRoutes.get("/profile", ensureAuthenticated, getUserProfile);
userRoutes.get("/edit", ensureAuthenticated, getEditProfileForm);
userRoutes.post(
  "/edit",
  ensureAuthenticated,
  upload.single("profilePicture"),
  updateUserProfile,
);
userRoutes.post("/delete", ensureAuthenticated, deleteUserAccount);

module.exports = userRoutes;
