const authMiddleWare = require("./auth");
const catchAsyncErrorsMiddleware = require("./catchAsyncErrors");
const errorMiddlware = require("./error");

module.exports = { authMiddleWare, catchAsyncErrorsMiddleware, errorMiddlware };
