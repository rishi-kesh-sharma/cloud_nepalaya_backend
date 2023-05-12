const { catchAsyncErrors } = require("../middlewares");
const { ApiFeatures, sendResponse } = require("../utils");
const path = require("path");
const fs = require("fs");

const convertStringToArray = (string) => {
  console.log(string?.split(","));
  return string?.split(",");
};
const { Service: Model, Quote, FAQ } = require("../models");
const { fileSizeFormatter } = require("../utils/file");

// CREATE Service
exports.create = catchAsyncErrors(async (req, res, next) => {
  let document;

  document = await Model.findOne({ title: req.body.title });
  if (document) {
    return sendResponse(res, 500, {
      success: true,
      message: "Title Already Taken. Must be unique!!",
      document,
    });
  }
  console.log(req.file);
  if (req.file) {
    const image = {
      fileName: req?.file?.filename,
      filePath: "/public/images/service",
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };

    document = {
      ...req.body,
      image: image,
      features: convertStringToArray(req.body?.features),
    };

    document = await Model.create(document);
  } else {
    document = await Model.create({
      ...req.body,
      features: convertStringToArray(req.body?.features),
    });
  }

  await document.save();
  sendResponse(res, 200, {
    success: true,
    message: "Service created",
    document,
  });
});

// GET ALL Service
exports.getAll = catchAsyncErrors(async (req, res, next) => {
  let apiFeature1 = new ApiFeatures(Model.find().populate("FAQs"), req.query);
  let documents = await apiFeature1.query;
  sendResponse(res, 200, {
    success: true,
    documents,
  });
});
// GET SINGLE Service
exports.getSingle = catchAsyncErrors(async (req, res, next) => {
  const document = await Model.findById(req.params._id).populate("FAQs");
  if (!document) {
    return sendResponse(res, 404, {
      success: false,
      message: `${Model.modelName} not found`,
    });
  }
  sendResponse(res, 200, { success: true, document });
});
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
      filePath: "/public/images/service",
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
    document = {
      ...req.body,
      image,
      features: convertStringToArray(req.body?.features),
    };
  } else {
    document = {
      ...req.body,
      features: convertStringToArray(req.body?.features),
    };
  }
  document = await Model.findByIdAndUpdate({ _id: req.params._id }, document, {
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

//DELETE Service
exports.remove = catchAsyncErrors(async (req, res, next) => {
  const document = await Model.findById(req.params._id);
  if (!document) {
    return sendResponse(res, 404, {
      success: false,
      message: `${Model.modelName} not found`,
    });
  }
  let quotes = await Quote.deleteMany({ service: req.params._id });
  let faqs = await FAQ.deleteMany({ service: req.params._id });
  const service = await document.remove();
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

  sendResponse(res, 200, {
    quotes,
    faqs,
    service,
    success: true,
    message: `${Model.modelName} deleted`,
  });
});
