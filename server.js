var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var dbConfig = require('./config/database.js'); 

require('./config/passport.js')(passport); // pass passport to func for config
mongoose.connect(dbConfig.url); // connect to the database

// set up express middleware
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies
app.use(bodyParser()); // get information from html forms
app.set('view-engine', 'ejs'); // set up ejs for templating
// app.use(express.static(__dirname + '/views'));
app.use(session({secret: 'itsasecret'})); // set up session secret
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport); // load routes, configured passport obj

app.listen(port);
console.log('listening on port:', port);
