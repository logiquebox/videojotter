const express = require("express");
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const mongoose = require("mongoose");

const app = express();

// Connect to the Mongo DB
mongoose
  .connect("mongodb://localhost/videojot-dev", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err.message);
  });

// Load Idea model
require("./models/Idea");
const Idea = mongoose.model("ideas");

// Handlebars Middleware
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// methodOverride Middleware
app.use(methodOverride("_method"));

// Express Session Middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Flash Middleware
app.use(flash());

// Global variable
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Index page
app.get("/", (req, res) => {
  const title = "Video Jotter";
  res.render("index", { title: title });
});

// Idea Index Page
app.get("/ideas", (req, res) => {
  Idea.find({})
    .sort({ date: "desc" })
    .then((ideas) => {
      res.render("ideas/index", {
        ideas: ideas,
      });
    });
});

// Add Idea page
app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});

// Edit idea page
app.get("/ideas/edit/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id,
  }).then((idea) => {
    res.render("ideas/edit", {
      idea: idea,
    });
  });
});

// Process form data
app.post("/ideas", (req, res) => {
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
app.put("/ideas/:id", (req, res) => {
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
app.delete("/ideas/:id", (req, res) => {
  Idea.deleteOne({
    _id: req.params.id,
  }).then((idea) => {
    req.flash("success_msg", "Video idea removed!");
    res.redirect("/ideas");
  });
});

// About page
app.get("/about", (req, res) => {
  res.render("about");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
