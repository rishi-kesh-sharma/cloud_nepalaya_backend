const mongoose = require("mongoose");
// CREATE SCHEMA FOR QUOTE
const Schema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: [true, "title must be unique"],
    },
    features: [String],

    mainText: {
      type: String,
      required: [true, "something has to be written about the service"],
    },
    image: {
      fileName: String,
      filePath: String,
      fileType: String,
      fileSize: String,
    },
    text: {
      type: String,
      required: [true, "something has to be written about the service"],
    },
    FAQs: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "FAQ",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", Schema);
