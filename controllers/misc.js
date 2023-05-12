const { catchAsyncErrors } = require("../middlewares");
const { sendResponse } = require("../utils");

const {
  User,
  Blog,
  FAQ,
  Quote,
  Service,
  Testimonial,
  Contact,
} = require("../models");

exports.getOverview = catchAsyncErrors(async (req, res, next) => {
  const totalUsers = (await User.find()).length;
  const totalBlogs = (await Blog.find()).length;
  const totalFAQs = (await FAQ.find()).length;
  const totalQuotes = (await Quote.find()).length;
  const totalServices = (await Service.find()).length;
  const totalTestimonials = (await Testimonial.find()).length;
  const totalContacts = (await Contact.find()).length;
  const overview = {
    totalBlogs,
    totalUsers,
    totalFAQs,
    totalQuotes,
    totalServices,
    totalTestimonials,
    totalContacts,
  };
  sendResponse(res, 200, overview);
});
