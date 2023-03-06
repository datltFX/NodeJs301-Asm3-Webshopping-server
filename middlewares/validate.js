const { check, body } = require("express-validator");
const User = require("../models/user");

exports.validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom((value, { req }) => {
      return User.findOne({
        email: value,
      }).then((user) => {
        if (!user) {
          return Promise.reject(
            "Email not exists, please pick a different one."
          );
        }
      });
    }),
  body(
    "password",
    "Please enter a password with only numbers and text and at least 8 characters."
  )
    .isLength({ min: 8 })
    .isAlphanumeric(),
];

exports.validateSignup = [
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom((value, { req }) => {
      return User.findOne({
        email: value,
      }).then((user) => {
        if (user) {
          return Promise.reject(
            "Email exists already, please pick a different one."
          );
        }
      });
    }),
  body(
    "password",
    "Please enter a password with only numbers and text and at least 8 characters."
  )
    .isLength({ min: 8 })
    .isAlphanumeric(),
];
