const express = require("express");
const router = express.Router();
const Auth = require("../controller/Auth");
const { loginValidate } = require("../middlewares/loginValidate");
const { registerValidate } = require("../middlewares/registerValidate");
const { validationResult } = require("express-validator");

function checkAuth(req, res, next) {
  if (req.session.userId) {
    return res.json({
      message: "User is already logged in",
      checkAuth: true,
      redirect: "/feed",
    });
  } else {
    next();
  }
}

router.get("/", checkAuth, function (req, res, next) {
  res.send("Login page");
});

router.get("/register", checkAuth, function (req, res, next) {
  res.send("Register page");
});

router.get("/logout", Auth.logout);

router.post("/", loginValidate, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  Auth.login(req, res, next);
});

router.post("/register", registerValidate, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  Auth.register(req, res, next);
});

module.exports = router;
