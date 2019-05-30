var mongoose = require('mongoose');

var EpisodeSchema = new mongoose.Schema({
  title: String,
  url: String,
  link: String,
  length: String,
  pubDate: Date,
  categories: [String],
  image_url: String
});

module.exports = mongoose.model('Episode', EpisodeSchema);
