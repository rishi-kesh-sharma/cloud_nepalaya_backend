const express = require("express");
const {
  miscController: { getOverview },
} = require("../controllers");
const {
  authMiddleWare: { isAuthenticatedUser, authorizeRoles },
} = require("../middlewares");

const router = express.Router();
// for all
router
  .route("/admin/overview")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin superadmin guest"),
    getOverview
  );

module.exports = router;
