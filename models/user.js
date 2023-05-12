const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// CREATE SCHEMA
const Schema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email has already been taken"],
      lowercase: [true, "email must be lowercase"],
    },
    contact: {
      type: Number,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    image: {
      fileName: String,
      filePath: String,
      fileType: String,
      fileSize: String,
    },
    role: {
      type: String,
      enum: ["guest", "admin", "superadmin"],
      default: "guest",
      required: [true, "role is required"],
    },
    authTokens: [String],
  },
  { timestamps: [true] }
);

// GET JWT TOKEN
Schema.methods.getJWTToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// hash password statics
Schema.statics.hashPassword = async function (password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

// compare password statics

Schema.statics.comparePassword = async function (
  enteredPassword,
  hashedPassword
) {
  const hasPasswordMatched = await bcrypt.compare(
    enteredPassword,
    hashedPassword
  );
  return hasPasswordMatched;
};
module.exports = mongoose.model("User", Schema);
