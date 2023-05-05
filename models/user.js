const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// CREATE SCHEMA FOR USER
const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    contact: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "this is default avatar",
    },
    role: {
      type: [String],
      enum: ["guest", "admin", "superadmin"],
      default: ["guest"],
      required: true,
    },
    authTokens: [String],
  },
  { timestamps: true }
);

UserSchema.methods.getJWTToken = async function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// hash password statics
UserSchema.statics.hashPassword = async function (password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

// compare password statics

UserSchema.statics.comparePassword = async function (
  enteredPassword,
  hashedPassword
) {
  const hasPasswordMatched = await bcrypt.compare(
    enteredPassword,
    hashedPassword
  );
  return hasPasswordMatched;
};
const User = mongoose.model("User", UserSchema);
module.exports = User;
