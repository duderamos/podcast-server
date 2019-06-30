const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

passport.use('signup', new localStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.create({ email, password });
    return done(null, user);
  } catch (error) {
    done(error);
  }
}));

passport.use('login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    const validate = await user.isValidPassword(password);

    if (!validate) {
      return done(null, false, { message: 'Wrong password' });
    }

    return done(null, user, { message: 'Logged successfully' });
  } catch (error) {
    return done(error);
  }
}));

passport.use(new JWTstrategy({
  secretOrKey: 'super-secret',
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
  try {
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));
