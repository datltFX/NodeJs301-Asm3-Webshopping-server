const express = require("express");
const AuthController = require("../controllers/auth");
const { validateLogin, validateSignup } = require("../middlewares/validate");
const router = express.Router();

//POST register
router.post("/register", validateSignup, AuthController.postRegisterUser);
//POST login
router.post("/login", validateLogin, AuthController.postLogin);
//POST logout
router.post("/logout", AuthController.postLogout);
module.exports = router;
