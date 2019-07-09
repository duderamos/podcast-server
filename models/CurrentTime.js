var mongoose = require('mongoose');

var CurrentTimeSchema = new mongoose.Schema({
  episodeId: String,
  currentTime: Number,
  userId: String,
});

module.exports = mongoose.model('CurrentTime', CurrentTimeSchema);
