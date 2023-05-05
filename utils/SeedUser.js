const User = require("../models/user");

const adminInfo = {
  username: "admin",
  email: "admin@gmail.com",
  contact: 9876543210,
  password: "admin123",
  address: "Lalitpur",
  role: ["superadmin"],
};
module.exports = () => {
  User.insertMany([adminInfo]);
};
