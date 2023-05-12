const Router = require("express").Router();

const {
  blog: { getAll, getSingle, create, update, remove },
} = require("../controllers");

const {
  auth: { authorizeRoles, isAuthenticated },
} = require("../middlewares");
const uploadImage = require("../middlewares/uploadImage");

// for all users
Router.route("/").get(getAll);
Router.route("/:_id").get(getSingle);
// for admin
Router.route("/").post(
  isAuthenticated,
  authorizeRoles("superadmin admin"),
  uploadImage("blog", "image"),
  create
);
Router.route("/:_id").put(
  isAuthenticated,
  authorizeRoles("admin superadmin"),
  uploadImage("blog", "image"),
  update
);

Router.route("/:_id").delete(
  isAuthenticated,
  authorizeRoles("admin superadmin"),
  remove
);

module.exports = Router;
