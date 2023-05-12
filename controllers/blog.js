const { catchAsyncErrors } = require("../middlewares");
const { ApiFeatures, sendResponse } = require("../utils");
const path = require("path");
const fs = require("fs");

const { Blog: Model } = require("../models");
const { fileSizeFormatter } = require("../utils/file");

// CREATE
exports.create = catchAsyncErrors(async (req, res, next) => {
  let document;
  if (req.file) {
    const image = {
      fileName: req?.file?.filename,
      filePath: "/public/images/blog",
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };

    document = await Model.create({ ...req.body, image: image });
  } else {
    document = await Model.create(req.body);
  }
  await document.save();
  sendResponse(res, 200, {
    success: true,
    message: `${Model.modelName} created !!!`,
  });
});

// GET ALL
exports.getAll = catchAsyncErrors(async (req, res, next) => {
  let apiFeature1 = new ApiFeatures(Model.find().populate("author"), req.query);
  let documents = await apiFeature1.query;
  sendResponse(res, 200, {
    success: true,
    documents,
  });
});
// GET SINGLE
exports.getSingle = catchAsyncErrors(async (req, res, next) => {
  const document = await Model.findById(req.params._id).populate("author");
  if (!document) {
    sendResponse(res, 404, {
      success: false,
      message: `${Model.modelName} not found`,
    });
  }
  sendResponse(res, 200, { success: true, document });
});
//UPDATE

exports.update = catchAsyncErrors(async (req, res, next) => {
  let document;

  if (req.file) {
    document = await Model.findById(req.params._id);

    console.log(document.image);
    if (
      document?.image?.fileName &&
      document?.image.fileNa != "undefined" &&
      Object.keys(document.image) != 0
    ) {
      let filePath = path.join(
        __dirname,
        `../${document?.image?.filePath}/${document?.image?.fileName}`
      );

      if (fs.existsSync()) {
        fs.unlinkSync(filePath);
      }
    }
    const image = {
      fileName: req?.file.filename,
      filePath: "/public/images/blog",
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
//DELETE
exports.remove = catchAsyncErrors(async (req, res, next) => {
  const document = await Model.findById(req.params._id);
  if (!document) {
    sendResponse(res, 404, {
      success: false,
      message: `${Model.modelName} not found`,
    });
  }
  await document.remove();

  if (
    document?.image?.fileName &&
    document?.image.fileNa != "undefined" &&
    Object.keys(document.image) != 0
  ) {
    let filePath = path.join(
      __dirname,
      `../${document?.image?.filePath}/${document?.image?.fileName}`
    );

    if (fs.existsSync()) {
      fs.unlinkSync(filePath);
    }
  }

  sendResponse(res, 200, {
    success: true,
    message: `${Model.modelName} deleted !!!`,
  });
});
