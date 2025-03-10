const { Router } = require("express");
const feedbackModel = require("../models/feedback.model");
const { isValidObjectId } = require("mongoose");


const feedbackRouter = Router();

feedbackRouter.get("/", async (req, res) => {
  const feedback = await feedbackModel.find();
  res.json(feedback);
});

feedbackRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(400).json({ message: "wrong id format" });

  const feedback = await feedbackModel.findById(id);
  if (!feedback) return res.status(404).json({ message: "feedback not found" });
  res.json(feedback);
});

feedbackRouter.post("/", async (req, res) => {
  const { title, category, status, details } = req.body;

  if (!title || !category || !status || !details)
    return res.status(400).json({
      message: "wrong params",
    });

  const existFeedback = await feedbackModel.findOne({ title });
  if (existFeedback)
    return res.status(400).json({ message: "user already exists" });
  
  await feedbackModel.create({
    title,
    status,
    category,
    details,
  });

  res.status(201).json({ message: "user created succsessfully" });
});

feedbackRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(400).json({ message: "wrong id format" });

  const feedback = await feedbackModel.findByIdAndDelete(id);
  if (!feedback)
    return res.status(404).json({ message: "feedback could not be deleted" });

  res.json({ message: "feedbck deleted succcsessfully", data: feedback });
});

feedbackRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(400).json({ message: "wrong id format" });

  const { title, category, status, details } = req.body;

  const updatedFeedback = {};

  if (title) updatedFeedback.title = title;
  if (category) updatedFeedback.category = category;
  if (status) updatedFeedback.status = status;
  if (details) updatedFeedback.details = details;

  const feedback = await feedbackModel.findByIdAndUpdate(id, updatedFeedback, {
    new: true,
  });
  if (!feedback)
    return res.status(400).json({ message: "feedback could not be updated" });
  res.json({ message: "user updated succsesfully", data: feedback });
});

module.exports = feedbackRouter;
