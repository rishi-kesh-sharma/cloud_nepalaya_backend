const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { User } = require("../models");
const { ErrorHandler, getAuthenticated, sendResponse } = require("../utils");
exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.headers["auth-token"] || req.cookies.token;

  if (!token) {
    return next(new ErrorHandler("please login to access this resource", 401));
  }
  const authenticatedUser = await getAuthenticated(token);
  if (!authenticatedUser) {
    res.redirect("/login");

    return next(new ErrorHandler("please login to access this resource", 401));
  }
  req.user = authenticatedUser;
  next();
});

exports.authorizeRoles = (authorizedRoles) => {
  return (req, res, next) => {
    const isAuthorized = authorizedRoles.includes(req?.user?.role);
    if (!isAuthorized) {
      sendResponse(res, 401, {
        success: false,
        message: "you are not authorized to access this resource",
      });
      next(new ErrorHandler(` not allowed to access this resource`, 400));
    }
    next();
  };
};

exports.isAuthorized = catchAsyncErrors(async (req, res, next) => {
  console.log(req.user);
  if (req.user) {
    let user = await User.findById(req.user._id);
    if (user) {
      req.params._id = req?.user?._id;
      console.log(req.params._id);
      next();
    } else {
      next(new ErrorHandler("you are not authorized user", 401));
    }
  }
  // if (req.params._id) {
  //   if (req.user._id == req.params._id) {
  //     next();
  //   } else {
  //     next(new ErrorHandler("you are not authorized user", 401));
  //   }
  // } else {
  //   next(new ErrorHandler("userId is missing", 400));
  // }
});
