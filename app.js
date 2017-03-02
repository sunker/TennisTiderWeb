const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const mongoose = require('mongoose'),
    a = require('./models/User'),
    b = require('./models/SlotsCache'); 

var users = require('./routes/users');
const userApi = require('./routes/userApi');
const clubApi = require('./routes/clubApi');
const slotApi = require('./routes/slotApi');
const authenticationApi = require('./routes/authenticationApi');
global._ = require('underscore');

var app = express();

const options = {
  index: "index.html"
};

// if (app.get('env') !== 'production') {

  options.index = "index.dev.html";

  // expose node_modules to client app
  app.use(express.static(__dirname + "/node_modules"));
// }


// app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public'), options));
app.use(express.static(path.join(__dirname, 'app')));

// Routes registration
// ---
app.use('/users', users);
app.use('/api/club', clubApi);
app.use('/api/slot', slotApi);
app.use('/api/authenticate', authenticationApi);
app.use('/api/user', userApi);

//DB connect
// var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
//                 replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };  
// mongoose.connect('mongodb://127.0.0.1/tennistider', (err) => {
mongoose.connect('mongodb://heroku_6pl9bfpx:9j9uur4mvva12agvm337k8lrgs@ds131139.mlab.com:31139/heroku_6pl9bfpx', { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } }, (err) => {
    if (err) console.log(err);
    else console.log('Connected to database');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


// var scraper = require('./scraping/scraper.js');
// scraper.getInstance().init();
require('./notification/userNotificationService');


module.exports = app;
