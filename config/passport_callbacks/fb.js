var User = require('../../app/models/user');

module.exports = {
  // facebook will send back the token and profile
  login: function(req, token, refreshToken, profile, done) {

      // asynchronous
    process.nextTick(function() {

      console.log('FACEBOOK PROFILE DETAILS:', profile); // I had to print the profile so I could see what information I could grab from it
      // apperaerntly, even though I specified in the scope that i want email, i still cant have it along with my useranme and gender

      if (!req.user) { // check if the user is already logged in, if not...

        // find the user in the database based on their facebook id
        User.findOne( {'facebook.id': profile.id}, function(err, user) {

        // if there is an error, stop everything and return that
        // ie an error connecting to the database
          if (err) {
            return done(err);
          }

        // if the user is found, then log them in
          if (user) {
            // the token will change each time the user logs in, so if you want to use it to access the API on thier behalf you have to keep updating it in the database
            user.facebook.token = token;
            user.save(function(err) {
              if (err) {
                throw err;
              }
              return done(null, user); // user found, return that user
            });
            
          } else {
            // if there is no user found with that facebook id, create them
            var newUser = new User();
            // set all of the facebook information in our user model
            newUser.facebook.id    = profile.id; // set the users facebook id                   
            newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
            newUser.facebook.name  = profile.displayName;// + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
            // console.log('EMAILS!!!!!', profile.emails);  //There is no email information in the profile!!!!!????
            // newUser.facebook.email = profile.emails;//[0].value; // facebook can return multiple emails so we'll take the first

            // save our user to the database
            newUser.save(function(err) {
              if (err) {
                throw err;
              }
              // if successful, return the new user
              return done(null, newUser);
            });
          }  
        });

      } else { // user already exists and is logged in, we have to link accounts

        var user            = req.user; // pull the user out of the session
        // update the current users facebook credentials
        user.facebook.id    = profile.id;
        user.facebook.token = token;
        user.facebook.name  = profile.displayName;

        // save the user
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

// the authorization step has introduces an if statement that encompases everything we had and only does it if it cant find a logged in user, 
