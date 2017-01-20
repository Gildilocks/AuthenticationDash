// load local strategy
var LocalStrategy = require('passport-local').Strategy;
// include local passport callbacks
var LocalCb = require('./passport_callbacks/local.js');
// load fb sstrategy
var FBStrategy = require('passport-facebook').Strategy;
// include facebook passport callbacks
var FBCb = require('./passport_callbacks/fb.js');
var TwitStrategy = require('passport-twitter').Strategy;
var TwitCb = require('./passport_callbacks/twitter.js');
// import config varibles
var configAuth = require('./auth.js');
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

  // local signup --------------------------------------------------------
  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password 
    // we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    LocalCb.signup
  ));

  //local login ----------------------------------------------------------
  passport.use('local-login', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
    LocalCb.login
  ));

  // facebook login ------------------------------------------------------
  passport.use(new FBStrategy({
    // pull in our app id and secret from our auth.js file
    clientID    : configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL : configAuth.facebookAuth.callbackURL
  },
    FBCb.login
  ));

  // twitter login -------------------------------------------------------
  passport.use(new TwitStrategy({
    consumerKey     : configAuth.twitterAuth.consumerKey,
    consumerSecret  : configAuth.twitterAuth.consumerSecret,
    callbackURL     : configAuth.twitterAuth.callbackURL
  },
    TwitCb.login
  ));

  // google login --------------------------------------------------------

};

