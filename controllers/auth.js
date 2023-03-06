const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

class AuthController {
  //POST register
  postRegisterUser = (req, res, next) => {
    console.log(req.body);
    const { name, email, password, phone } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.array()[0].msg);
    }
    // hash password
    bcrypt
      .hash(password, 12)
      .then((hashedPass) => {
        const user = new User({
          fullName: name,
          email: email,
          password: hashedPass,
          phoneNumber: phone,
          role: "client",
          cart: { items: [] },
        });
        return user.save();
      })
      .then((result) => {
        res.status(201).json({
          message: "User created!",
          userId: result._id,
        });
      })
      .catch((err) => console.log(err));
  };

  //POST login
  postLogin = (req, res, next) => {
    // console.log(req.body);
    const { email, password } = req.body;
    // check email exists
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.array()[0].msg);
    }
    User.findOne({ email: email })
      .then((user) => {
        bcrypt.compare(password, user.password).then((isMatch) => {
          if (!isMatch) {
            return res
              .status(404)
              .send({ message: "Wrong password!!!", user: user });
          } else {
            req.session.userId = user._id;
            // console.log("-------auth.js.32------", req.session);
            return req.session.save((err) => {
              // console.log(err);
              res.status(200).send(user);
            });
          }
        });
      })
      .catch((err) => console.log(err));
  };

  // logout
  postLogout = (req, res, next) => {
    req.session.destroy((err) => {
      console.log("---session destroy---");
      res.status(200).json("Logout success!");
    });
  };
}
module.exports = new AuthController();
