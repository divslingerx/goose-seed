const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const CommentSchema = new Schema(

  {
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    body: String,
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: true,
  },
);

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
