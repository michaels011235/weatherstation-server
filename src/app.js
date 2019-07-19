const express = require('express');
const morgan = require('morgan'); // logging.
const bodyParser = require('body-parser');
const views  = require('./routes/views');
const dataInput = require('./routes/dataInput');


const app = express();
app.use(morgan('dev')); // load in development mode.
app.use(bodyParser.json());


// define counting variable.
// the syntax with app.locals enables the variable to be accessed in an 
// external routes file.
app.locals.counter = [0];
console.log(app.locals.counter);

// load routes
app.use('/', views);
app.use('/data', dataInput);

// make the public directory available.
app.use('/static', express.static('public')); 

// logger function for time of request.
const requestTime = function(req, res, next) {
  let event = new Date(Date.now());
  req.requestTime = event.toUTCString();
  console.log('Requested at ' + req.requestTime);
  // console.log(req);
  next();
};
// use it as middleware
app.use(requestTime);


// simple json API which returns date.
app.get('/date', function(req, res) {
  res.json({
    time: req.requestTime
  });
});


// error handling.
app.use(function(req, res, next) {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.send({
    status: err.status,
    message: err.message
  });
});


const port = 3000;
app.listen(port, function(){
  console.log(`Server listening on port ${port}`);
});