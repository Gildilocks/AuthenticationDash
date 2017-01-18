var User = require('../../app/models/user');

module.exports = {
  signup: function(req, email, password, done) {
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

  },

  login: null
}