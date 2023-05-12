const express = require("express");
const {
  auth: { authorizeRoles },
} = require("../middlewares");
const router = express.Router();
const {
  user: { remove, getAll, getSingle, update, updatePassword, updateRole },
} = require("../controllers");
const { isAuthorized } = require("../middlewares/auth");
const uploadImage = require("../middlewares/uploadImage");

router.route("/").get(authorizeRoles("superadmin admin guest"), getAll);
router.route("/:_id").get(authorizeRoles("superadmin admin"), getSingle);
router
  .route("/:_id")
  .put(authorizeRoles("superadmin"), uploadImage("user", "image"), update);
router
  .route("/profile/me")
  .put(isAuthorized, uploadImage("user", "image"), update);
router.route("/:_id").delete(authorizeRoles("superadmin"), remove);
router.route("/profile/me").delete(isAuthorized, remove);
router.route("/role/:_id").put(authorizeRoles("superadmin"), updateRole);
router
  .route("/profile/password/me")
  .put(isAuthorized, uploadImage("user", "image"), updatePassword);
router
  .route("/password/:_id")
  .put(
    authorizeRoles("superadmin"),
    uploadImage("user", "image"),
    updatePassword
  );
module.exports = router;
