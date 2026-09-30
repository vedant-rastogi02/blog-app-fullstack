const express = require("express");
const {
  getPostForm,
  createPost,
  getPosts,
  getPostById,
  getEditPostForm,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const postRoutes = express.Router();
const upload = require("../config/multer");
const { ensureAuthenticated } = require("../middlewares/Auth");
postRoutes.get("/add", getPostForm);
postRoutes.get("/", getPosts);
// post logic
postRoutes.post(
  "/add",
  ensureAuthenticated,
  upload.array("images", 5),
  createPost,
);
postRoutes.get("/:id", getPostById);
postRoutes.get("/:id/edit", getEditPostForm);
postRoutes.put(
  "/:id",
  ensureAuthenticated,
  upload.array("images", 5),
  updatePost,
);
postRoutes.delete("/:id", ensureAuthenticated, deletePost);

module.exports = postRoutes;
