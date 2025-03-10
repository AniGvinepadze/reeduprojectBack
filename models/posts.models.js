const { default: mongoose } = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  category: String,
  details: String,
  status: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  comments: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'comment', default: [] },
  ],
  upVotes: Number,
});

module.exports = mongoose.model('post', postSchema);
