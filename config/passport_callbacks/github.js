var User = require('../../app/models/user');

module.exports = {
  login: function(req, accessToken, refreshToken, profile, done) {
    console.log('GITHUB PROFILE INFO:', profile);
    console.log('GITHUB ACCESS TOKEN:', accessToken);
    console.log('GITHUB REFRESH TOKEN:', refreshToken);


    if (!req.user) { // if the request does not show that there is already logged in...

      User.findOne({'github.id': profile.id}, function (err, user) {  
        if (err) { // if theres an error call done with the error
          return done(err);
        }

        if (user) { // if a user is found, update token and call done on the user

          user.github.token = accessToken;

          user.save(function(err) {
            if (err) {
              throw err;
            }
            return done(null, user);
          });

        } else { // otherwise, make a user, save it, and pass it to done
          var newUser = new User();

          newUser.github.id = profile.id;
          newUser.github.username = profile.username;
          newUser.github.profileUrl = profile.profileUrl;
          newUser.github.token = accessToken;

          newUser.save(function(err) {
            if (err) {
              throw err;
            }
            return done(null, newUser);
          });
        }

      });

    } else { // grab the user in the request and update its information rather than making a now user in the db

      var user = req.user;
      user.github.id = profile.id;
      user.github.username = profile.username;
      user.github.profileUrl = profile.profileUrl;
      user.github.token = accessToken;


      user.save(function(err) {
        if (err) { 
          throw err;
        }
        return done(null, user);
      });
    }
    

  }
};
