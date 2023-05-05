const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// CREATE SCHEMA FOR BLOG
const BlogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    likesCount: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;
