const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");
const mongoose = require("mongoose");

// Load Idea model
require("../models/Idea");
const Idea = mongoose.model("ideas");

// Idea Index Page
router.get("/", ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({ date: "desc" })
    .then((ideas) => {
      res.render("ideas/index", {
        ideas: ideas,
      });
    });
});

// Add Idea page
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("ideas/add");
});

// Edit idea page
router.get("/edit/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id,
  }).then((idea) => {
    if (idea.user != req.user.id) {
      req.flash("error_msg", "Not Authorized");
      res.redirect("/ideas");
    } else {
      res.render("ideas/edit", {
        idea: idea,
      });
    }
  });
});

// Process form data
router.post("/", ensureAuthenticated, (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please add some details" });
  }
  if (errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details,
    });
  } else {
    const newIdea = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id,
    };
    new Idea(newIdea).save().then((idea) => {
      req.flash("success_msg", "Video idea Added!");
      res.redirect("/ideas");
    });
  }
});

// Process form edit
router.put("/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id,
  }).then((idea) => {
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save().then((idea) => {
      req.flash("success_msg", "Video idea Updated!");
      res.redirect("/ideas");
    });
  });
});

// Delete Idea
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Idea.deleteOne({
    _id: req.params.id,
  }).then((idea) => {
    req.flash("success_msg", "Video idea removed!");
    res.redirect("/ideas");
  });
});

module.exports = router;
