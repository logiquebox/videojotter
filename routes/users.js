const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { redirect } = require("express/lib/response");
const { route } = require("./ideas");
const router = express.Router();

// Load User Model
require("../models/User");
const User = mongoose.model("users");

// Login route
router.get("/login", (req, res) => {
  res.render("users/login");
});

// Login Form POST
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Register route
router.get("/register", (req, res) => {
  res.render("users/register");
});

// Register Form POST
router.post("/register", (req, res) => {
  let errors = [];
  if (req.body.password != req.body.password2) {
    errors.push({ text: "password do not match" });
  }
  if (req.body.password.length < 4) {
    errors.push({ text: "password must be atleat 4 characters" });
  }
  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
    });
  } else {
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        req.flash("error_msg", "Email already exist");
        res.redirect("/users/register");
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            // Store hash in your password DB.
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can login"
                );
                res.redirect("/users/login");
              })
              .catch((err) => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

// Logout user
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Logged out successful");
  res.redirect("/users/login");
});

module.exports = router;
