const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema({
  title: String,
  firstAuthor: String,
  domain: String,
  readingStage: String,
  citationCount: Number,
  impactScore: String,
  dateAdded: Date,
});

module.exports = mongoose.model("Paper", paperSchema);