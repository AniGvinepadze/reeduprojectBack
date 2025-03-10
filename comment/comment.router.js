const express = require("express");
const commentModel = require("../models/comment.model");
const usersModel = require("../models/users.model");

const commentRouter = express.Router();
commentRouter.post("/", async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const user = await usersModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newComment = new commentModel({
      comment,
      user: req.userId,
    });

    await newComment.save();

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

commentRouter.get("/", async (req, res) => {
  const comment = await commentModel.find().populate("user");
  if (!comment) return res.status(404).json({ message: "user not found" });
  res.json(comment);
});

commentRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  const user = await usersModel.findById(id).populate("comments");
  if (!user) return res.status(404).json({ message: "user not found" });

  res.json(user.comments);
});

module.exports = commentRouter;
