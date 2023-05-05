const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const {
  ErrorHandler,
  getAuthenticatedUser,
  sendResponse,
} = require("../utils");
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const token = req.headers["auth-token"];
  if (!token) {
    return next(new ErrorHandler("please login to access this resource", 401));
  }
  const authenticatedUser = await getAuthenticatedUser(token);
  if (!authenticatedUser) {
    res.redirect("/login");

    return next(new ErrorHandler("please login to access this resource", 401));
  }
  req.user = authenticatedUser;
  next();
});

exports.authorizeRoles = (authorizedRoles) => {
  return (req, res, next) => {
    const isAuthorized = req.user.role.filter((item) => {
      return authorizedRoles.includes(item);
    });

    if (!isAuthorized.length > 0) {
      sendResponse(res, 401, {
        success: false,
        message: "you are not authorized to access this resource",
      });
      next(new ErrorHandler(` not allowed to access this resource`, 400));
    }
    next();
  };
};

exports.isAuthorizedUser = catchAsyncErrors((req, res, next) => {
  console.log(req.params.userId);
  if (req.params.userId) {
    if (req.user._id == req.params.userId) {
      next();
    } else {
      next(new ErrorHandler("you are not authorized user", 401));
    }
  } else {
    next(new ErrorHandler("userId is missing", 400));
  }
});
