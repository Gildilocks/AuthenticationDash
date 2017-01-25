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

  // facebook route ------------------------------------------------------
  // route to process facebook authentication and login 
  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // twitter route -------------------------------------------------------
  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // google route --------------------------------------------------------
  app.get('/auth/google', passport.authenticate('google', {
    accessType: 'offline',
    approvalPrompt: 'force', // THIS IS NEEDED TO GET THE REFRESH TOKEN!!!!! or maybe you can only do it once an hour
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.readonly']
  }));

  app.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect : '/profile',
      failureRedirect : '/'
    })
  );
  
  // google route --------------------------------------------------------
  app.get('/auth/github', passport.authenticate('github', {scope: ['user:email']}));

  app.get('/auth/github/callback',
    passport.authenticate('github', {
      successRedirect : '/profile',
      failureRedirect : '/'
    })
  );


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
