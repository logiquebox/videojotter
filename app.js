const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
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
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Index page
app.get("/", (req, res) => {
  const title = "Video Jotter";
  res.render("index", { title: title });
});

// Add Idea page
app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
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
    res.send("Success");
  }
});

// About page
app.get("/about", (req, res) => {
  res.render("about");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
