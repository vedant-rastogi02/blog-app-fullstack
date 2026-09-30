const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

// render login page
exports.getLogin = asyncHandler((req, res) => {
  res.render("login.ejs", {
    title: "Login",
    error: "",
    user: req.user,
  });
});

// login logic
exports.Login = asyncHandler(async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.render("login", {
        title: "Login",
        user: req.user,
        error: info.message,
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      res.redirect("/user/profile");
    });
  })(req, res, next);
});

// render register page
exports.getRegister = asyncHandler((req, res) => {
  res.render("register.ejs", {
    title: "Register",
    user: req.user,
    error: "",
  });
});

// register logic
exports.Register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.render("register", {
        title: "Register",
        user: req.user,
        error: "User already exists",
      });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save the user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.redirect("/auth/login");
  } catch (error) {
    res.render("register", {
      title: "Register",
      user: req.user,
      error: error.message,
    });
  }
});

// Logout logic
exports.Logout = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.redirect("/auth/login");
  });
});
