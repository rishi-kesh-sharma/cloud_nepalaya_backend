const { catchAsyncErrors } = require("../middlewares");
const {
  getAuthenticated,
  sendResponse,
  sendToken,
  ErrorHandler,
} = require("../utils");

const { User: Model } = require("../models");
const { fileSizeFormatter } = require("../utils/file");

// REGISTER USER
exports.register = catchAsyncErrors(async (req, res, next) => {
  const { password, confirmPassword, username, email, role, address, contact } =
    req.body;

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
  const hashedPassword = await Model.hashPassword(password);
  let document;
  if (req.file) {
    const image = {
      fileName: req?.file?.filename,
      filePath: "/public/images/user",
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
    document = await Model.create({
      ...req.body,
      image: image,
      password: hashedPassword,
    });
  } else {
    document = await Model.create({ ...req.body, password: hashedPassword });
  }
  await document.save();
  sendResponse(res, 200, {
    success: true,
    message: `${Model.modelName} created !!!`,
  });

  sendResponse(res, 200, {
    success: true,
    message: `${Model.modelName} is registered`,
    document: document,
  });
});

// LOGIN USER
exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //  checking if user has given password and email both

  if (!email || !password) {
    sendResponse(res, 400, {
      success: false,
      message: "please enter email and password",
    });
    return next(new ErrorHandler("please enter email and password", 400));
  }

  const document = await Model.findOne({ email: email }).select("+password");

  if (!document) {
    sendResponse(res, 404, {
      success: false,
      message: "invalid email or password",
    });
    return next(new ErrorHandler("invalid email or password", 401));
  }
  //    compare password statics
  const isPasswordMatched = await Model.comparePassword(
    password,
    document.password
  );
  if (!isPasswordMatched) {
    sendResponse(res, 401, {
      success: false,
      message: "invalid email or password",
    });

    return next(new ErrorHandler("invalid email or password", 401));
  }
  res.user = document;

  sendToken(res);
});

// LOGOUT USER
exports.logout = catchAsyncErrors(async (req, res, next) => {
  const token = req.headers["auth-token"] || req.cookies.token;
  const document = await Model.findOne({
    authTokens: { $all: [`${token}`] },
  }).select({ password: 0 });
  if (!document) {
    return next(new ErrorHandler("please login to access this resource", 401));
  }
  document.authTokens = [];

  await document.save();
  res
    .status(200)
    .clearCookie("token")
    .json({ success: true, message: "user logged out!!!" });
});

exports.checkTokenValidity = catchAsyncErrors(async (req, res, next) => {
  const token = req.headers["auth-token"] || req.cookies.token;
  if (!token) return sendResponse(res, 400, { success: false });
  const authenticatedUser = await getAuthenticated(token);
  if (!authenticatedUser) {
    return sendResponse(res, 400, { success: false });
  }
  const user = await Model.findOne({
    authTokens: { $all: [`${token}`] },
  }).select({ password: 0 });

  if (!user) {
    return sendResponse(res, 400, { success: false });
  }
  return sendResponse(res, 200, { success: true, user });
});
