const { catchAsyncErrors } = require("../middlewares");
const { ApiFeatures, sendResponse } = require("../utils");

const { FAQ: Model, Service } = require("../models");

// CREATE FAQ
exports.create = catchAsyncErrors(async (req, res, next) => {
  let items;
  if (req.body.service) {
    items = req.body;
  } else {
    const { question, answer, type } = req.body;
    items = { question, answer, type };
  }

  document = await Model.create(items);
  document = await document.save();
  if (req.body.service) {
    let service = await Service.findById(req.body.service);
    service = await Service.findByIdAndUpdate(
      { _id: req.body.service },
      {
        FAQs: [...service.FAQs, document._id],
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );
  }

  sendResponse(res, 200, { success: true, message: "FAQ created", document });
});

// GET ALL FAQ
exports.getAll = catchAsyncErrors(async (req, res, next) => {
  let apiFeature1 = new ApiFeatures(Model.find(), req.query);
  let documents = await apiFeature1.query;
  sendResponse(res, 200, {
    success: true,
    documents,
  });
});
// GET SINGLE FAQ
exports.getSingle = catchAsyncErrors(async (req, res, next) => {
  const document = await Model.findById(req.params._id);
  if (!document) {
    return sendResponse(res, 404, {
      success: false,
      message: `${Model.modelName} not found`,
    });
  }
  sendResponse(res, 200, { success: true, document });
});

exports.update = catchAsyncErrors(async (req, res, next) => {
  let document = await Model.findById(req.params._id);

  if (!document) {
    return sendResponse(res, 404, {
      success: false,
      message: `${Model.modelName} not found`,
    });
  }

  if (document) {
    let service = await Service.findOne({
      FAQs: { $elemMatch: { $eq: document._id } },
    });

    if (service) {
      service.FAQs = service?.FAQs?.filter((item) => {
        console.log(item.toString(), document._id.toString());
        if (item.toString() != document._id.toString()) {
          return item;
        }
      });

      await service.save();
    }
  }
  document = await Model.findByIdAndUpdate(
    { _id: req.params._id },
    {
      ...req.body,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  sendResponse(res, 200, {
    success: true,
    document,
    message: `${Model.modelName} updated !!!`,
  });
});

//DELETE FAQ
exports.remove = catchAsyncErrors(async (req, res, next) => {
  const document = await Model.findById(req.params._id);
  console.log(document);
  if (!document) {
    return sendResponse(res, 404, {
      success: false,
      message: `${Model.modelName} not found`,
    });
  }

  if (document) {
    let service = await Service.findOne({
      FAQs: { $elemMatch: { $eq: document._id } },
    });

    if (service) {
      service.FAQs = service?.FAQs.filter((item) => {
        console.log(item.toString(), document._id.toString());
        if (item.toString() != document._id.toString()) {
          return item;
        }
      });
      await service.save();
    }
  }
  document.remove();

  sendResponse(res, 200, {
    success: true,
    message: `${Model.modelName} deleted`,
  });
});
