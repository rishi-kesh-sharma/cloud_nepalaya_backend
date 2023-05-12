const express = require("express");
const {
  auth: { login, logout, register, checkTokenValidity },
} = require("../controllers");
const router = express.Router();

const {
  auth: { isAuthenticated },
} = require("../middlewares");
const { authorizeRoles } = require("../middlewares/auth");
const uploadImage = require("../middlewares/uploadImage");

// for all
// router
//   .route("/register")
//   .post(isAuthenticated, authorizeRoles("superadmin"), register);
router.route("/register").post(uploadImage("user", "image"), register);

//for registered users
router.route("/login").post(login);

// for logged in user
router.route("/logout").get(isAuthenticated, logout);
router.route("/isTokenValid").get(isAuthenticated, checkTokenValidity);

module.exports = router;
