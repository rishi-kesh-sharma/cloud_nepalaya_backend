const mongoose = require("mongoose");
// CREATE SCHEMA
const Schema = mongoose.Schema(
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
    image: {
      fileName: String,
      filePath: String,
      fileType: String,
      fileSize: String,
    },
    likesCount: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", Schema);
