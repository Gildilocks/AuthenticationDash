var User = require('../../app/models/user');

module.exports = {
  login: function(accessToken, refreshToken, profile, done) {
    console.log('GITHUB PROFILE INFO:', profile);
    console.log('GITHUB ACCESS TOKEN:', accessToken);

    User.findOne({'github.id': profile.id}, function (err, user) {  
      if (err) { // if theres an error call done with the error
        return done(err);
      }

      if (user) { // if a user is found (update token if needed) and call done on the user

        user.github.token = accessToken;

        user.save(function(err) {
          if (err) {
            throw err;
          }
          return done(null, user);
        });

      } else { // make a user, save it, and pass it to done
        var newUser = new User();

        newUser.github.id = profile.id;
        newUser.github.userName = profile.userName;
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
  }
};
