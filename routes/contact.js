const express = require("express");
const {
  auth: { authorizeRoles },
} = require("../middlewares");
const router = express.Router();
const {
  contact: { create, remove, getAll, getSingle },
} = require("../controllers");
const { isAuthenticated } = require("../middlewares/auth");

// for general users
router.route("/").post(create);

// for admin
router
  .route("/")
  .get(isAuthenticated, authorizeRoles(" superadmin admin"), getAll);
router
  .route("/:_id")
  .delete(isAuthenticated, authorizeRoles("superadmin admin"), remove);
router
  .route("/:_id")
  .get(isAuthenticated, authorizeRoles("superadmin admin"), getSingle);

module.exports = router;
