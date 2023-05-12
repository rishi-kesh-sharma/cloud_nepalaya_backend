const { catchAsyncErrors: catchAsyncErrors } = require("../middlewares");
const { ApiFeatures, ErrorHandler, sendResponse } = require("../utils");

const { User: Model } = require("../models");
const { fileSizeFormatter } = require("../utils/file");
const path = require("path");
const fs = require("fs");

// UPDATE USER PASSWORD

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  console.log(req.body);
  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(new Error("fields not filled properly", 400));
  }
  if (confirmPassword != newPassword) {
    return next("passwords not matching", 400);
  }
  const user = await Model.findById(req.user._id).select("+password");

  if (!user) {
    sendResponse(404, res, { success: false, message: "user not found " });
  }
  console.log(user);

  const isPasswordMatched = await Model.comparePassword(
    oldPassword,
    user.password
  );
  if (!isPasswordMatched) {
    return next(new ErrorHandler("old password is incorrect", 400));
  }
  const hashedPassword = await Model.hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save();
  sendResponse(res, 200, {
    success: true,
    message: "password updated successfully",
  });
});

// UPDATE USER

exports.update = catchAsyncErrors(async (req, res, next) => {
  let document;

  if (req.file) {
    document = await Model.findById(req.params._id);

    if (
      document?.image?.fileName &&
      document?.image.fileName != "undefined" &&
      Object.keys(document.image) != 0
    ) {
      let filePath = path.join(
        __dirname,
        `../${document?.image?.filePath}/${document?.image?.fileName}`
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    const image = {
      fileName: req?.file.filename,
      filePath: "/public/images/user",
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
    document = { ...req.body, image };
  } else {
    document = req.body;
  }
  document = await Model.findByIdAndUpdate(req.params._id, document, {
    new: true,
    upsert: true,
    runValidators: true,
  });
  if (!document) {
    sendResponse(res, 404, {
      success: false,
      message: `${Model.modelName} not found`,
    });
  }
  sendResponse(res, 200, {
    success: true,
    document,
    message: `${Model.modelName} updated !!!`,
  });
});

// UPDATE USER ROLE

exports.updateRole = catchAsyncErrors(async (req, res, next) => {
  let user = await Model.findById(req.params._id);

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
exports.remove = catchAsyncErrors(async (req, res, next) => {
  let document = await Model.findById(req.params._id);

  if (!document) {
    sendResponse(404, res, { success: false, message: "user not found " });
    return next(
      new ErrorHandler(`user does not exist with id: ${req.params._id}`)
    );
  }
  if (
    document?.image?.fileName &&
    document?.image.fileNa != "undefined" &&
    Object.keys(document.image) != 0
  ) {
    let filePath = path.join(
      __dirname,
      `../${document?.image?.filePath}/${document?.image?.fileName}`
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  document = document.remove();
  sendResponse(res, 200, {
    document,
    success: true,
    message: "user deleted successfully",
  });
});
// GET ALL USERS

exports.getAll = catchAsyncErrors(async (req, res, next) => {
  let apiFeature1 = new ApiFeatures(
    Model.find().select({ password: 0, authTokens: 0 }),
    req.query
  );
  let documents = await apiFeature1.query;
  sendResponse(res, 200, {
    success: true,
    documents,
  });
});
// GET SINGLE USER

exports.getSingle = catchAsyncErrors(async (req, res, next) => {
  const document = await Model.findById(req.params._id).select({
    password: 0,
    authTokens: 0,
  });
  if (!document) {
    sendResponse(404, res, { success: false, message: "user not found " });
    return next(new ErrorHandler("user not found", 400));
  }
  sendResponse(res, 200, { success: true, document });
});

// forgot password

// exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
//   const user = await Model.findOne({ email: req.body.email });
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
