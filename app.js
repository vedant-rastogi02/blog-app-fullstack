require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const passport = require("passport");
const methodOveride = require("method-override");
const app = express();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/CommentRoutes");
const passportConfig = require("./config/passport");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const bcrypt = require("bcryptjs");
const errorHandler = require("./middlewares/errorHandler");

// session middleware
app.use(
  session({
    secret: "keyword cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
  }),
);
// method overide middleware
app.use(methodOveride("_method"));

passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

// port
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ejs
app.set("view engine", "ejs");

// home page
app.get("/", (req, res) => {
  res.render("home.ejs", {
    user: req.user,
    error: "",
    title: "Home",
  });
});
// routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/", commentRoutes);
app.use("/user", userRoutes);

// error handler
app.use(errorHandler);

// start the server
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log("database connected");

      console.log(`server is up at ${PORT}`);
    });
  })
  .catch(() => {
    console.log("database connection failed ");
  });
