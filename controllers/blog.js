const {
  catchAsyncErrorsMiddleware: catchAsyncErrors,
} = require("../middlewares");
const { ApiFeatures, sendResponse, ErrorHandler } = require("../utils");

const { Blog } = require("../models");

// REGISTER BLOG
exports.registerBlog = catchAsyncErrors(async (req, res, next) => {
  const { title, text } = req.body;
  const blog = new Blog({ title, text, author: req.user._id });

  const savedBlog = await blog.save();
  if (!savedBlog) {
    return sendResponse(res, 400, {
      success: false,
      message: "unable to register",
    });
  }
  sendResponse(res, 200, {
    success: true,
    message: "blog is registered",
    blog: savedBlog,
  });
});

exports.getAllBlogs = catchAsyncErrors(async (req, res, next) => {
  let apiFeature1 = new ApiFeatures(Blog.find().populate("author"), req.query);
  let allBlogs = await apiFeature1.query;

  sendResponse(res, 200, {
    success: true,
    blogs: allBlogs,
  });
});
// GET SINGLE Blog

exports.getSingleBlog = catchAsyncErrors(async (req, res, next) => {
  const blog = await Blog.findById(req.params.blogId).populate("author");
  blog.populated("author");
  if (!blog) {
    sendResponse(404, res, { success: false, message: "blog not found " });

    return next(new ErrorHandler("blog not found", 400));
  }

  sendResponse(res, 200, { success: true, blog });
});
