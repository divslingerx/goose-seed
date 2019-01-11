const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const PostSchema = new Schema(

  {
    tags: [String],
    title: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: ['draft', 'published', 'deleted'],
      default: 'draft',
    },

    slug: {
      type: String,
      required: true,
    },

    image: String,
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],

  },
  {
    timestamps: true,
  },
);

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
