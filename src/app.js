const express = require('express');
const morgan = require('morgan'); // logging.
const bodyParser = require('body-parser');
const views  = require('./routes/views');
const api = require('./routes/api');
const fs = require('fs');

// Instantiate an express object. Typical workflow.
const app = express();

let dataFile = '/tmp/testing-server/dataFile.json';

function loadData(path) {
  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) {
      console.log('reading data: some error occured');
      app.locals.dataArray = [];
    }
    app.locals.dataArray = JSON.parse(data);
    console.log('read the datafile.');
    console.log(app.locals.dataArray);
  });
}
loadData();



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

// save the data after save_after_seconds seconds.

let save_after_seconds = 10000;

setInterval(() => {
  let jsonData = JSON.stringify(app.locals.dataArray);
  fs.writeFile(dataFile, jsonData, 'utf8', (err) => {
    if (err) throw err;
    console.log('writing to datafile successful');
  });
}, save_after_seconds);


