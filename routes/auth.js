const express = require("express");
const {
  authController: { loginUser, logout, registerUser, checkTokenValidity },
} = require("../controllers");
const router = express.Router();

const {
  authMiddleWare: { isAuthenticatedUser },
} = require("../middlewares");

// for all
router.route("/register").post(registerUser);

//for registered users
router.route("/login").post(loginUser);

// for logged in user
router.route("/logout").get(isAuthenticatedUser, logout);
router.route("/isTokenValid").get(checkTokenValidity);

module.exports = router;
