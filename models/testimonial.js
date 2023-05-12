const mongoose = require("mongoose");
// CREATE SCHEMA FOR
const Schema = mongoose.Schema(
  {
    ratings: {
      type: Number,
      required: true,
      max: [5, "ratings cannot be more than 5"],
    },
    text: {
      type: String,
      required: true,
    },
    image: {
      fileName: String,
      filePath: String,
      fileType: String,
      fileSize: String,
    },
    reviewer: {
      type: String,
      required: true,
      unique: [true, "reviewer must be unique"],
    },
    designation: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", Schema);
