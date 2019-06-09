var mongoose = require('mongoose');

var EpisodeSchema = new mongoose.Schema({
  title: String,
  url: String,
  link: String,
  length: String,
  pubDate: Date,
  categories: [String],
  imageUrl: String,
  podcastId: String,
});

module.exports = mongoose.model('Episode', EpisodeSchema);
