var User = require('../../app/models/user');

module.exports = {
  // facebook will send back the token and profile
  login: function(token, refreshToken, profile, done) {

      // asynchronous
    process.nextTick(function() {

      // find the user in the database based on their facebook id
      User.findOne( {'facebook.id': profile.id}, function(err, user) {

      // if there is an error, stop everything and return that
      // ie an error connecting to the database
        if (err) {
          return done(err);
        }

      // if the user is found, then log them in
        if (user) {
          return done(null, user); // user found, return that user
        } else {
          // if there is no user found with that facebook id, create them
          var newUser = new User();

          console.log('PROFILE DETAILS:', profile); // I had to print the profile so I could see what information I could grab from it
          // apperaerntly, even though I specified in the scope that i want 

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
    });
  }
};
