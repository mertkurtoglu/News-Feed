const { body, check } = require("express-validator");
const datas = require("../client/src/data/data.json");

const registerValidate = [
  body("name", "Name is required.")
    .isLength({ min: 2 })
    .withMessage("Username Must Be at Least 2 Characters.")
    .isLength({ max: 16 })
    .withMessage("Username Must Be Less Than 16 Characters.")
    .trim()
    .escape(),
  body("email", "Email Must Be a Valid!").isEmail().trim().escape(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password Must Be at Least 6 Characters")
    .matches("[0-9]")
    .withMessage("Password Must Contain a Number")
    .matches("[A-Z]")
    .withMessage("Password Must Contain an Uppercase Letter")
    .trim()
    .escape(),
  check("country", "Please Select a Country").isIn(Object.keys(datas.countries)),
];

module.exports = { registerValidate };
