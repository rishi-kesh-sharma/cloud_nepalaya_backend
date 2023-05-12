const jwt = require("jsonwebtoken");
const { User: Model } = require("../models");
const getAuthenticated = async (token) => {
  console.log(token);
  const decodedData = await jwt.verify(token, process.env.JWT_SECRET_KEY);
  const document = await Model.findById(decodedData._id);
  return document;
};
module.exports = getAuthenticated;
