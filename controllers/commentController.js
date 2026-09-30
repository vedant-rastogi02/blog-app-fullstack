const Post = require("../models/Post");
const Comment = require("../models/Comment");
const asyncHandler = require("express-async-handler");

// add comments
exports.addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  //   validation
  if (!post) {
    res.render("postDetails", {
      title: "Post ",
      post,
      user: req.user,
      error: "Post not found",
      success: "",
    });
  }
  if (!content) {
    return res.render("postDetails", {
      title: "Post ",
      post,
      user: req.user,
      error: "Comment content is required",
      success: "",
    });
  }
  //   save comment
  const comment = new Comment({
    content,
    post: postId,
    author: req.user._id,
  });
  await comment.save();
  post.comments.push(comment._id);
  await post.save();
  res.redirect(`/posts/${postId}`);
});

exports.getCommentForm = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.render("postDetails", {
      title: "Post",
      comment,
      user: req.user,
      error: "Post not found",
      success: "",
    });
  }
  res.render("editComment", {
    title: "Comment",
    comment,
    user: req.user,
    error: "",
    success: "",
  });
});

exports.updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.render("postDetails", {
      title: "Post",
      comment,
      user: req.user,
      error: "Comment not found",
      success: "",
    });
  }
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post",
      comment,
      user: req.user,
      error: "You are not authorized to edit this comment",
      success: "",
    });
  }
  comment.content = content || comment.content;
  await comment.save();
  res.redirect(`/posts/${comment.post}`);
});

exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.render("postDetails", {
      title: "Post",
      comment,
      user: req.user,
      error: "Comment not found",
      success: "",
    });
  }
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post",
      comment,
      user: req.user,
      error: "You are not authorized to delete this comment",
      success: "",
    });
  }
  await Comment.findByIdAndDelete(req.params.id);
  res.redirect(`/posts/${comment.post}`);
});
