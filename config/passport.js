// load the strategy
var LocalStrategy = require('passport-local').Strategy;
// load the user model
var User = require('../app/models/user');
// expose the function to the app
module.exports = function(passport) {
  // passport session setup
  // required for persistent login sessions
  // passport needs the ability to serialze and deserialize users out of session

  // used to seialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // local signup
  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password 
    // we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {

  }
  ));
};

