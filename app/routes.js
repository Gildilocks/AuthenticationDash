module.exports = function(app, passport) {
  
  // homepage
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  // login page
  app.get('/login', function(req, res) {
    res.render('login.ejs');
  });

  // app.post('/login', function(req, res) {
  //   //passport stuff
  // })

  // signup page
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage') // render the page with passed in flash data
    });
  });

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
