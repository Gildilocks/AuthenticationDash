module.exports = function(app, passport) {
  
  // homepage
  app.get('/', function(req, res) {
    res.render('index.ejs');
    // res.sendfile('index.html');
  });

  // login page
  app.get('/login', function(req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage') // render the page with passed in flash data
    });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // signup page
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage') // render the page with passed in flash data
    });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // route to process facebook authentication and login       // try adding different things to the scope!!!! and add them to the database, and to the profile view if successful
  app.get('/auth/facebook', passport.authenticate('facebook'));

  //
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));


  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user: req.user // get user data out of the request
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}
