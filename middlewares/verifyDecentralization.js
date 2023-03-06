const User = require("../models/user");

exports.verifyUser = (req, res, next) => {
  User.findById(req.session.userId)
    .then((user) => {
      if (user) {
        next();
      } else {
        return res.status(403).send("You are not authorized!");
      }
    })
    .catch((err) => console.log(err));
};

// verify counselors
exports.verifyConselors = (req, res, next) => {
  this.verifyUser(req, res, () => {
    if (req.user.role === "counselors" || req.user.role === "admin") {
      next();
    } else {
      return res.status(403).send("You are not authorized!");
    }
  });
};

// verify admin
exports.verifyAdmin = (req, res, next) => {
  this.verifyUser(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      return res.status(403).send("You are not authorized!");
    }
  });
};
