const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "internal server error";

  // WRONG MONGODB ID ERROR
  if (err.name === "castError") {
    const message = `Resource not found. invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  // mongoose duplicate key error

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 1100);
  }
  // WRONG JWT
  if (err.name === "JsonWebTokenError") {
    const message = `json web token is invalid `;
    err = new ErrorHandler(message, 400);
  }
  // JWT EXPIRE ERROR
  if (err.name === "TokenExpiredError") {
    const message = `json web token is  expired`;
    err = new ErrorHandler(message, 400);
  }
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
