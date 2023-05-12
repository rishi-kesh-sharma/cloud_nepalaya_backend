const express = require("express");
const {
  misc: { getOverview },
} = require("../controllers");
const {
  auth: { isAuthenticated, authorizeRoles },
} = require("../middlewares");

const router = express.Router();
// for all
router.route("/").get(getOverview);

module.exports = router;
