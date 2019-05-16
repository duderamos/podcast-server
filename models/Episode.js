var mongoose = require('mongoose');

var EpisodeSchema = new mongoose.Schema({
  title: String,
  url: String
});

module.exports = mongoose.model('Episode', EpisodeSchema);
