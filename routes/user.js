const express = require("express");
const router = express.Router();

const {
  userController: {
    getSingleUser,
    getAllUser,
    updateUser,
    deleteUser,
    updateUserPassword,
    updateUserRole,
  },
} = require("../controllers");
const {
  authMiddleWare: { authorizeRoles, isAuthenticatedUser, isAuthorizedUser },
} = require("../middlewares");

// for all

// for admin
// router
//   .route("/admin/all")
//   .get(authorizeRoles("superadmin admin guest"), getAllUser);
// router
//   .route("/admin/:userId")
//   .get(authorizeRoles("superadmin admin guest"), getSingleUser);
// router.route("/admin/:userId").put(authorizeRoles("superadmin"), updateUser);
// router
//   .route("/admin/role/:userId")
//   .put(authorizeRoles("superadmin"), updateUserRole);
// router.route("/admin/:userId").delete(authorizeRoles("superadmin"), deleteUser);

// for authrorized user
// router.route("/me/password").put(updateUserPassword);
// router.route("/me/:userId").get(isAuthorizedUser, getSingleUser);
// router.route("/me/:userId").put(isAuthorizedUser, updateUser);
// router.route("/me/:userId").delete(isAuthorizedUser, deleteUser);

module.exports = router;
