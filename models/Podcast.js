var mongoose = require('mongoose');

var PodcastSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Podcast', PodcastSchema);
