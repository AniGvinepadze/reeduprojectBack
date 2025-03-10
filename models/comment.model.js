const { default: mongoose } = require("mongoose");
const { comment } = require("postcss");

const commentSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }
});

module.exports = mongoose.model("comment",commentSchema)