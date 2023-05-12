const express = require("express");
const {
  auth: { authorizeRoles, isAuthenticated },
} = require("../middlewares");
const router = express.Router();
const {
  testimonial: { create, remove, getAll, getSingle, update },
} = require("../controllers");
const uploadImage = require("../middlewares/uploadImage");

// for general users
router
  .route("/")
  .post(
    isAuthenticated,
    authorizeRoles("superadmin admin"),
    uploadImage("testimonial", "image"),
    create
  );

// for admin
router.route("/").get(getAll);
router.route("/:_id").get(getSingle);
router
  .route("/:_id")
  .delete(isAuthenticated, authorizeRoles("superadmin admin"), remove);
router
  .route("/:_id")
  .put(
    isAuthenticated,
    authorizeRoles("superadmin admin"),
    uploadImage("testimonial", "image"),
    isAuthenticated,
    update
  );
router
  .route("/:_id")
  .delete(
    isAuthenticated,
    authorizeRoles("superadmin admin"),
    isAuthenticated,
    remove
  );

module.exports = router;
