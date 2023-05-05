const bcryptjs = require("bcryptjs");
const {
  catchAsyncErrorsMiddleware: catchAsyncErrors,
  errorMiddlware,
} = require("../middlewares");
const {
  ApiFeatures,
  destroyToken,
  ErrorHandler,
  getAuthenticatedUser,
  sendEmail,
  sendResponse,
  sendToken,
} = require("../utils");

const { User } = require("../models");

// forgot password

// exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     return next(new Error("user not found", 404));
//   }

//   // get reset password token

//   const resetToken = user.getResetPasswordToken();
//   await user.save({ validateBeforeSave: false });

//   const resetPasswordurl = `${req.protocol}://${req.get(
//     "host"
//   )}/api/v1/reset/${resetToken}`;
//   const message = `your password reset token is :- \n\n ${resetPasswordurl}\n\n if you have not requested this email , then please  igonre `;
//   try {
//     await sendEmail({
//       email: user.email,
//       subject: `Ecommerce password REcovery`,
//       message,
//     });
//     res.status(200).json({
//       success: true,
//       message: `email sent to ${user.email} successfully`,
//     });
//   } catch (err) {
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     await user.save({ validateBeforeSave: false });
//     return next(new ErrorHandler(err.message, 500));
//   }
// });

// UPDATE USER PASSWORD

exports.updateUserPassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(new Error("fields not filled properly", 400));
  }
  if (confirmPassword != newPassword) {
    return next("passwords not matching", 400);
  }
  const user = await User.findById(req.user._id);

  if (!user) {
    sendResponse(404, res, { success: false, message: "user not found " });
  }

  const isPasswordMatched = await User.comparePassword(
    oldPassword,
    user.password
  );

  if (!isPasswordMatched) {
    return next(new ErrorHandler("old password is incorrect", 400));
  }

  user.password = newPassword;
  await user.save();
  sendResponse(res, 200, {
    success: true,
    message: "password updated successfully",
  });
});

// UPDATE USER

exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  console.log(req.body);

  let user = await User.findByIdAndUpdate(req.params.userId, {
    $set: req.body,
    new: true,
    runValidators: true,
  });

  if (!user) {
    sendResponse(404, res, { success: false, message: "user not found " });
  }
  await user.save();

  sendResponse(res, 200, {
    success: true,
    message: "user  updated successfully",
  });
});

// UPDATE USER ROLE

exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.params.userId);

  if (!user) {
    sendResponse(404, res, { success: false, message: "user not found " });
  }

  user.role = req.body.role;
  await user.save();
  sendResponse(res, 200, {
    success: true,
    message: "user role updated successfully",
  });
});

// DELETE USER
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    sendResponse(404, res, { success: false, message: "user not found " });
    return next(
      new ErrorHandler(`user does not exist with id: ${req.params.userId}`)
    );
  }

  const removedUser = user.remove();
  sendResponse(res, 200, {
    removedUser,
    success: true,
    message: "user deleted successfully",
  });
});

// GET ALL USERS

exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 11;
  let apiFeature1 = new ApiFeatures(User.find(), req.query).search();
  let allUsers = await apiFeature1.query;
  const totalUsers = allUsers.length;

  const apiFeature2 = new ApiFeatures(User.find(), req.query)
    .search()
    .pagination(resultPerPage);
  let users = await apiFeature2.query;

  const isNext =
    parseInt(req.query.page) * resultPerPage < totalUsers &&
    totalUsers > resultPerPage;
  sendResponse(res, 200, {
    success: true,
    users,
    next: isNext,
    prev: apiFeature2.prev,
    skip: apiFeature2.skip,
  });
});
// GET SINGLE USER

exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    sendResponse(404, res, { success: false, message: "user not found " });

    return next(new ErrorHandler("user not found", 400));
  }

  sendResponse(res, 200, { success: true, user });
});
