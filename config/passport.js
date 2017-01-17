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
    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({'local.email': email}, function(err, user) {
        if (err) {
          // if there are any errors, return the error
          return done(err);
        } 
        // check to see if theres already a user with that email
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new User();
          // set the user's local credentials
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          // save the user
          newUser.save(function() {
            if (err) {
              throw err;
            } else {
              return done(null, newUser);
            }
          }); 
        }

      });
    });

  }
  ));
};

