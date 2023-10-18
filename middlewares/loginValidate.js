const { body } = require("express-validator");

const loginValidate = [
  body("email", "Email Must Be a Valid Address").isEmail().trim().escape(),
  body("password", "Password Must Be Min.6 Digits").isLength({ min: 6 }).trim().escape(),
];

module.exports = { loginValidate };
