const express = require("express");
const CommentRoutes = express.Router();
const {
  addComment,
  getCommentForm,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const { ensureAuthenticated } = require("../middlewares/Auth");
CommentRoutes.post("/posts/:postId/comments", ensureAuthenticated, addComment);
CommentRoutes.get("/comments/:id/edit", getCommentForm);
CommentRoutes.put("/comments/:id", ensureAuthenticated, updateComment);

CommentRoutes.delete("/comments/:id", ensureAuthenticated, deleteComment);
module.exports = CommentRoutes;
