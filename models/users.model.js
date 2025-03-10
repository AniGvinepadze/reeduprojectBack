const { default: mongoose } = require("mongoose");


const userSchema = new mongoose.Schema({
    fullName: String,
    email: {type: String, lowercase: true},
    password: String,
    comments: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'comment', default: [] },
      ],
    posts: {type: [mongoose.Schema.Types.ObjectId], ref: 'post', default: []}
})

module.exports = mongoose.model('user', userSchema)