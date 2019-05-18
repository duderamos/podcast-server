var mongoose = require('mongoose');

var CurrentTimeSchema = new mongoose.Schema({
  episodeId: String,
  currentTime: Number
});

module.exports = mongoose.model('CurrentTime', CurrentTimeSchema);
