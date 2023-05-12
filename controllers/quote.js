const { catchAsyncErrors } = require("../middlewares");
const { ApiFeatures, sendResponse } = require("../utils");

const { Quote: Model } = require("../models");

// CREATE
exports.create = catchAsyncErrors(async (req, res, next) => {
  const document = await Model.create({ ...req.body });
  await document.save();
  sendResponse(res, 200, {
    document,
    success: true,
    message: `${Model.modelName} created !!!`,
  });
});

// GET ALL
exports.getAll = catchAsyncErrors(async (req, res, next) => {
  let apiFeature1 = new ApiFeatures(
    Model.find().populate("service"),
    req.query
  );
  let documents = await apiFeature1.query;
  sendResponse(res, 200, {
    success: true,
    documents,
  });
});
// GET SINGLE
exports.getSingle = catchAsyncErrors(async (req, res, next) => {
  const document = await Model.findById(req.params._id);
  if (!document) {
    sendResponse(res, 404, {
      success: false,
      message: `${Model.modelName} not found`,
    });
  }
  sendResponse(res, 200, { success: true, document });
});
//DELETE
exports.remove = catchAsyncErrors(async (req, res, next) => {
  const document = await Model.findById(req.params._id);
  if (!document) {
    sendResponse(res, 404, {
      success: false,
      message: `${Model.modelName} not found`,
    });
  }
  document.remove();
  sendResponse(res, 200, {
    success: true,
    document,
    message: `${Model.modelName} deleted !!!`,
  });
});
