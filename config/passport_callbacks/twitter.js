var User = require('../../app/models/user');

module.exports = {
  login: function(req, token, tokenSecret, profile, done) {

    console.log('TWITTER PROFILE DETAILS:', profile);
    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Twitter
    process.nextTick(function() {

      
      if (!req.user) {

        User.findOne({'twitter.id': profile.id}, function(err, user) {
          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          if (err) {
            return done(err);
          }

          // if the user is found then log them in
          if (user) {
            return done(null, user); // user found, return that user
          } else {
            // if there is no user, create them
            var newUser = new User();

            // set all of the user data that we need
            newUser.twitter.id          = profile.id;
            // the token does not change between login, there is no need to chang it in the database
            newUser.twitter.token       = token;
            newUser.twitter.username    = profile.username;
            newUser.twitter.displayName = profile.displayName;

            // save our user into the database
            newUser.save(function(err) {
              if (err) {
                throw err;
              }
              return done(null, newUser);
            });
          }
        });

      } else {
        var user = req.user;
        user.twitter.id          = profile.id;
        user.twitter.token       = token;
        user.twitter.username    = profile.username;
        user.twitter.displayName = profile.displayName;

        user.save(function(err) {
          if(err) {
            throw err;
          }
          return done(null, user); // user found, return that user
        });
      }


    });
  }
};
