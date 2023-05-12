const mongoose = require("mongoose");
// CREATE SCHEMA FOR Contact
const Schema = mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enums: ["general", "service_related"],
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FAQ", Schema);
