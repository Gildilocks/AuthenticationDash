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

 // signup page
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage') // render the page with passed in flash data
    });
  });

  // profile page
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user: req.user // get user data out of the request
    });
  });

  // logout route
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });


// local route -------------------------------------------------------

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));
  //    ####### CONNECT ROUTE #######
  app.get('/connect/local', function(req, res) {
    res.render('connect-local.ejs', {message: req.flash('loginMessage')});
  });
  app.post('/connect/local', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // facebook route ------------------------------------------------------
  // route to process facebook authentication and login 
  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));
  //    ####### CONNECT ROUTE #######
  // send to facebook to do the authentication
  app.get('/connect/facebook', passport.authorize('facebook', {scope: 'email'}));
  // handle the callback after facebook has authorized the user
  app.get('/connect/facebook/callback',
    passport.authorize('facebook', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));

  // twitter route -------------------------------------------------------
  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));
  //    ####### CONNECT ROUTE #######
  // send to twitter to do the authentication
  app.get('/connect/twitter', passport.authorize('twitter', {scope: 'email'}));
  // handle the callback after twitter has authorized the user
  app.get('/connect/twitter/callback',
    passport.authorize('twitter', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));


  // google route --------------------------------------------------------
  app.get('/auth/google', passport.authenticate('google', {
    accessType: 'offline', // THESE TWO PARAMS ARE NEEDED TO GET THE REFRESH TOKEN!!
    prompt: 'consent', // APPERENTLY YOU ONLY GET THE REFRESH FOKEN WHEN IT LISTS THE PERMISSIONS AND YOU GIVE CONSENT
    // approvalPrompt: 'force', 
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.readonly'] // if you want the user to just be able to click to login without repeating consent or approval, only have the scope
  }));

  app.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: '/profile',
      failureRedirect: '/'
    })
  );
  //    ####### CONNECT ROUTE #######
  // send to google to do the authentication
  app.get('/connect/google', passport.authorize('google', {
    accessType: 'offline',
    prompt: 'consent',
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.readonly']
  }));
  // the callback after google has authorized the user
  app.get('/connect/google/callback',
    passport.authorize('google', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));
  
  // github route --------------------------------------------------------
  app.get('/auth/github', passport.authenticate('github', {scope: ['user:email']}));

  app.get('/auth/github/callback',
    passport.authenticate('github', {
      successRedirect: '/profile',
      failureRedirect: '/'
    })
  );
  //    ####### CONNECT ROUTE #######
  // send to github to do the authentication
  app.get('/connect/github', passport.authorize('github', {scope: ['user:email']}));
  // the callback after github has authorized the user
  app.get('/connect/github/callback', 
    passport.authorize('twitter', {
      successRedirect:'/profile',
      failureRedirect: '/'
    }));

};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}
