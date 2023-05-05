const Router = require("express").Router();

const {
  blogController: { getAllBlogs, getSingleBlog, registerBlog },
} = require("../controllers");

const {
  authMiddleWare: { authorizeRoles, isAuthenticatedUser },
} = require("../middlewares");

// for all users
Router.route("/all").get(getAllBlogs);

// for admin
Router.route("/admin/register").post(
  isAuthenticatedUser,
  authorizeRoles("superadmin admin"),
  registerBlog
);
Router.route("/:blogId").get(getSingleBlog);

module.exports = Router;
