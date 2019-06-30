var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

UserSchema.pre('save', async function() {
  const user = this;
  console.log(user);
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
});

UserSchema.methods.isValidPassword = async function(password) {
  const user = this;

  const compare = await bcrypt.compare(password, user.password);

  return compare;
}

module.exports = mongoose.model('User', UserSchema);
