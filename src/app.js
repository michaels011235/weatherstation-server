const express = require('express');
const morgan = require('morgan'); // logging.
const bodyParser = require('body-parser');
const views  = require('./routes/views');
const dataInput = require('./routes/dataInput');
const api = require('./routes/api');

// Instantiate an express object. Typical workflow.
const app = express();


// define counting variable.
// the syntax with app.locals enables the variable to be accessed in an 
// external routes file.
app.locals.counter = [0];
console.log(app.locals.counter);

app.use(morgan('dev')); // load in development mode.
app.use(bodyParser.json());

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



// LOAD ROUTES. - Has to be loaded after middleware.
// make the public directory available.
app.use('/static', express.static('public')); 

// load routes
app.use('/', views);
app.use('/data', dataInput);
app.use('/api', api);


// error handling.
// This function will be called if no route handles the request.
app.use(function(req, res, next) {
  const err = new Error('Not found.');
  err.status = 404;
  // Pass the error on to error handling function
  next(err);
});

// error handling function. gets the error passed via a next(err) statement.
app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.send({
    status: err.status,
    message: err.message
  });
});

// make the server listen at a port.
const port = 3000;
app.listen(port, function(){
  console.log(`Server listening on port ${port}`);
});