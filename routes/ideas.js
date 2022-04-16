const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Load Idea model
require("../models/Idea");
const Idea = mongoose.model("ideas");

// Idea Index Page
router.get("/", (req, res) => {
  Idea.find({})
    .sort({ date: "desc" })
    .then((ideas) => {
      res.render("ideas/index", {
        ideas: ideas,
      });
    });
});

// Add Idea page
router.get("/add", (req, res) => {
  res.render("ideas/add");
});

// Edit idea page
router.get("/edit/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id,
  }).then((idea) => {
    res.render("ideas/edit", {
      idea: idea,
    });
  });
});

// Process form data
router.post("/", (req, res) => {
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
    };
    new Idea(newIdea).save().then((idea) => {
      req.flash("success_msg", "Video idea Added!");
      res.redirect("/ideas");
    });
  }
});

// Process form edit
router.put("/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
  Idea.deleteOne({
    _id: req.params.id,
  }).then((idea) => {
    req.flash("success_msg", "Video idea removed!");
    res.redirect("/ideas");
  });
});

module.exports = router;
