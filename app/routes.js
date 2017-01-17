module.exports = function(app, passport) {
  
  // homepage
  app.get('/', function(req, res) {
    res.render('index.ejs');
    // res.sendfile('index.html');
  });

  // login page
  app.get('/login', function(req, res) {
    res.render('login.ejs');
  });

  app.post('/login', function(req, res) {
    console.log(req.body);
    //  passport stuff
  });

  // signup page
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage') // render the page with passed in flash data
    });
  });

  app.post('/signup', function(req, res) {
    console.log(req.body);
    //  passport stuff
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
