var mongoose = require('mongoose');

var EpisodeSchema = new mongoose.Schema({
  title: String,
  url: String,
  duration: String,
});

module.exports = mongoose.model('Episode', EpisodeSchema);
