const jwt = require("jsonwebtoken");
const { User } = require("../models");
const getAuthenticatedUser = async (token) => {
  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await User.findById(decodedData.id);
  return user;
};
module.exports = getAuthenticatedUser;
