const Post = require("../models/Post");
const File = require("../models/File");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");

// rendering post form
exports.getPostForm = asyncHandler((req, res) => {
  res.render("newPost", {
    title: "Create Post",
    user: req.user,
    error: "",
    success: "",
  });
});

// creating new post
exports.createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.render("newPost", {
      title: "Create Post",
      user: req.user,
      error: "atleast one image is required",
      success: "",
    });
  }

  const images = await Promise.all(
    req.files.map(async (file) => {
      const newFile = new File({
        url: file.path,
        public_id: file.filename,
        uploaded_by: req.user._id,
      });

      await newFile.save();

      return {
        url: newFile.url,
        public_id: newFile.public_id,
      };
    }),
  );

  const newPost = new Post({
    title,
    content,
    author: req.user._id,
    images,
  });

  await newPost.save();

  res.render("newPost", {
    title: "Create Post",
    user: req.user,
    error: "",
    success: "Post created successfully",
  });
});
// get all posts
exports.getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("author", "username");
  res.render("posts", {
    title: "Posts",
    posts,
    user: req.user,
    error: "",
    success: "",
  });
});

exports.getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "username")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        model: "User",
      },
    });
  res.render("postDetails", {
    title: "Posts",
    post,
    user: req.user,
    success: "",
    error: "",
  });
});

// get edit post form
exports.getEditPostForm = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("editPost", {
    title: "Edit Post",
    post,
    user: req.user,
    success: "",
    error: "",
  });
});

exports.updatePost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  //find the post
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      post,
      user: req.user,
      error: "Post not found",
      success: "",
    });
  }

  if (post.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post",
      post,
      user: req.user,
      error: "You are not authorized to edit this post",
      success: "",
    });
  }

  post.title = title || post.title;
  post.content = content || post.content;
  if (req.files) {
    await Promise.all(
      post.images.map(async (image) => {
        await cloudinary.uploader.destroy(image.public_id);
      }),
    );
  }
  post.images = await Promise.all(
    req.files.map(async (file) => {
      const newFile = new File({
        url: file.path,
        public_id: file.filename,
        uploaded_by: req.user._id,
      });
      await newFile.save();
      return {
        url: newFile.url,
        public_id: newFile.public_id,
      };
    }),
  );

  await post.save();
  res.redirect(`/posts/${post._id}`);
});

exports.deletePost = asyncHandler(async (req, res) => {
  //find the post
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      post,
      user: req.user,
      error: "Post not found",
      success: "",
    });
  }
  if (post.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post",
      post,
      user: req.user,
      error: "You are not authorized to delete this post",
      success: "",
    });
  }
  await Promise.all(
    post.images.map(async (image) => {
      await cloudinary.uploader.destroy(image.public_id);
    }),
  );
  await Post.findByIdAndDelete(req.params.id);
  res.redirect("/posts");
});
