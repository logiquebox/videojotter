if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI:
      "mongodb+srv://codeboss:pass@cluster0.ob0bx.mongodb.net/videojot-prod?retryWrites=true&w=majority",
  };
} else {
  module.exports = {
    mongoURI: "mongodb://localhost/videojot-dev",
  };
}
