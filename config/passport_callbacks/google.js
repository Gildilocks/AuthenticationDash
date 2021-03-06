var User = require('../../app/models/user');


module.exports = {
  login: function(req, token, refreshToken, params, profile, done) {

    // console.log('GOOGLE PROFILE DETAILS:', profile);
    // console.log('GOOGLE TOKEN DETAILS:', token);
    console.log('GOOGLE PARAM DETAILS:', params);
    console.log('GOOGLE REFRESH TOKEN DETAILS:', refreshToken); // ONCE YOU HAVE THE REFRESH TOKEN YOU CAN KEEP USING IT TO GET WORKING ACCESS TOKENS!!!!

    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Twitter
    process.nextTick(function() {


      if (!req.user) {

        
        User.findOne({'google.id': profile.id}, function(err, user) {
          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          if (err) {
            return done(err);
          }

          // if the user is found then log them in
          if (user) {
            user.google.token = token;

            user.save(function(err) {
              if(err) {
                throw err;
              }
              return done(null, user); // user found, return that user
            });

            
          } else {
            // if there is no user, create them
            var newUser = new User();

            // set all of the user data that we need
            newUser.google.id    = profile.id;
            newUser.google.token = refreshToken;
            newUser.google.name  = profile.displayName;
            newUser.google.email = profile.emails[0].value; // pull the first email

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
        user.google.id    = profile.id;
        user.google.token = refreshToken;
        user.google.name  = profile.displayName;
        user.google.email = profile.emails[0].value;

        user.save(function(err) {
          if (err) {
            throw err;
          }
          return done(null, user);
        });
      }


    });
  }
};
