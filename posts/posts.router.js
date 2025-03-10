const { Router } = require("express");
const postsModels = require("../models/posts.models");
const usersModel = require("../models/users.model");
const { isValidObjectId } = require("mongoose");

const postsRouter = Router();
//looks good
postsRouter.get("/", async (req, res) => {
  const posts = await postsModels
    .find()
    .populate("user", "email fullName")
    .select("-password");
  res.json(posts);
});

//good
postsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(400).json({ message: "wrong id format" });

  const post = await postsModels.findById(id);
  if (!post) return res.status(404).json({ message: "post not found" });
  res.json(post);
});

//works
postsRouter.post("/", async (req, res) => {
  const { title, category, details, status } = req.body;
  if (!title || !category || !details || !status)
    return res.status(400).json({ message: "invalid params" });

  const newPost = await postsModels.create({
    title,
    category,
    details,
    status,
    user: req.userId,
    upVotes: 0,
  });
  await usersModel.findByIdAndUpdate(req.userId, {
    $push: { posts: newPost._id },
  });
  res.status(201).json({ newPost });
});

postsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  if (!isValidObjectId(id))
    return res.status(400).json({ message: "not a valid object id" });

  const post = await postsModels.findByIdAndDelete(id);
  if (!post)
    return res.status(404).json({ message: "post could not be deleted" });

  // await postsModel.findByIdAndDelete(id);

  await usersModel.findByIdAndUpdate(
    { _id: req.userId },
    {
      $pull: { posts: id },
    }
  );

  res.json({ message: "post deleted succsessfully" });
});

postsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(400).json({ message: "wrong id format" });

  const { title, category, status, details } = req.body;

  const updatedPost = {};

  if (title) updatedPost.title = title;
  if (category) updatedPost.category = category;
  if (status) updatedPost.status = status;
  if (details) updatedPost.details = details;

  const post = await postsModels.findByIdAndUpdate(id, updatedPost, {
    new: true,
  });
  if (!post)
    return res.status(400).json({ message: "post could not be updated" });
  res.json({ message: "user's post updated succsesfully", data: post });
});

module.exports = postsRouter;
