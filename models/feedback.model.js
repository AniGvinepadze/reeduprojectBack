const { default: mongoose } = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, required: true },
  details: { type: String, required: true },
});

module.exports = mongoose.model("feedback", feedbackSchema);
