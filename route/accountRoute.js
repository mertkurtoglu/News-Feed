const express = require("express");
const router = express.Router();
const Account = require("../controller/Account");

function checkAuth(req, res, next) {
  if (!req.session.userId || req.session.userId === undefined) {
    return res.json({
      message: "User not logged in",
      checkAuth: false,
      redirect: "/",
    });
  } else {
    next();
  }
}

router.get("/account", checkAuth, Account.account);
router.post("/account", Account.savePreferences);

module.exports = router;
