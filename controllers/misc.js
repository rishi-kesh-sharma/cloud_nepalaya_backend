const {
  catchAsyncErrorsMiddleware: catchAsyncErrors,
} = require("../middlewares");
const { sendResponse } = require("../utils");

const { User, Blog } = require("../models");

exports.getOverview = catchAsyncErrors(async (req, res, next) => {
  const totalUsers = (await User.find()).length;
  const totalBlogs = (await Blog.find()).length;
  const overview = {
    totalBlogs,
    totalUsers,
  };
  sendResponse(res, 200, overview);
});
