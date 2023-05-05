const {
  catchAsyncErrorsMiddleware: catchAsyncErrors,
} = require("../middlewares");
const {
  getAuthenticatedUser,
  sendResponse,
  sendToken,
  ErrorHandler,
} = require("../utils");

const { User } = require("../models");

// REGISTER USER
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const {
    password,
    confirmPassword,
    username,
    email,
    profilePic,
    role,
    address,
    contact,
  } = req.body;

  if (!password || !confirmPassword || !username || !email || !role) {
    sendResponse(res, 400, {
      success: false,
      message: "fields not filled properly",
    });
    return next(new ErrorHandler("password fields empty", 400));
  }

  if (password !== confirmPassword) {
    sendResponse(res, 400, {
      success: false,
      message: "passwords not matching",
    });
    return next(new ErrorHandler("passwords not matching", 401));
  }
  const hashedPassword = await User.hashPassword(password);
  const user = new User({
    password: hashedPassword,
    username,
    email,
    profilePic,
    role,
    address,
    contact,
  });

  const savedUser = await user.save();

  sendResponse(res, 200, {
    success: true,
    message: "user is registered",
    user: savedUser,
  });
});

// LOGIN USER
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //  checking if user has given password and email both

  if (!email || !password) {
    sendResponse(res, 400, {
      success: false,
      message: "please enter email and password",
    });
    return next(new ErrorHandler("please enter email and password", 400));
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    sendResponse(res, 404, {
      success: false,
      message: "invalid email or password",
    });
    return next(new ErrorHandler("invalid email or password", 401));
  }
  //    compare password statics
  const isPasswordMatched = await User.comparePassword(password, user.password);
  if (!isPasswordMatched) {
    sendResponse(res, 401, {
      success: false,
      message: "invalid email or password",
    });

    return next(new ErrorHandler("invalid email or password", 401));
  }
  res.user = user;

  sendToken(res);
});

// LOGOUT USER
exports.logout = catchAsyncErrors(async (req, res, next) => {
  const token = req.headers["auth-token"];
  const user = await User.findOne({
    authTokens: { $all: [`${token}`] },
  }).select({ password: 0 });

  user.authTokens = [];
  await user.save();
  sendResponse(res, 200, {
    success: true,
    message: "user logged out !!!",
    action: "logout",
  });
  // destroyToken(res);
});

exports.checkTokenValidity = catchAsyncErrors(async (req, res, next) => {
  const token = req.headers["auth-token"];
  if (!token) return sendResponse(res, 400, { success: false });
  const authenticatedUser = await getAuthenticatedUser(token);
  if (!authenticatedUser) {
    return sendResponse(res, 400, { success: false });
  }
  const user = await User.findOne({
    authTokens: { $all: [`${token}`] },
  }).select({ password: 0 });

  if (!user) {
    return sendResponse(res, 400, { success: false });
  }

  return sendResponse(res, 200, { success: true, user });
});
