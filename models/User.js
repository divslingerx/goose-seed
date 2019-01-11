const mongoose = require('mongoose');



const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    avatar: String,
    birthday: Date,
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phoneNumber: { type: Number },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, trim: true },
    confirmed: { type: Boolean, default: false },
    permission: {
      type: String,
      required: true,
      enum: ['admin', 'manager', 'user'],
      default: 'user',
    },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
