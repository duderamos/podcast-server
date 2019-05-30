var mongoose = require('mongoose');

var PodcastSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  imageUrl: String,
  imageTitle: String,
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Podcast', PodcastSchema);
