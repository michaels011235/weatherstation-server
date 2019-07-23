const express = require('express');
const morgan = require('morgan'); // logging.
const bodyParser = require('body-parser');
const views  = require('./routes/views');
const api = require('./routes/api');
const fs = require('fs');
require('dotenv').config();

// Instantiate an express object. Typical workflow.
const app = express();

const dataDirectory = process.env.DATADIR;
const dataFile = dataDirectory + '/' + process.env.DATAFILENAME;

function initializeStorage() {
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory);
  }

  if(!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([]));
  }
}
initializeStorage();

function loadData() {
  try {
    console.log('Loading data.');
    const file = fs.readFileSync(dataFile, {encoding:'utf8'});
    // app.locals is a built in object. 
    // requests can access app.locals.
    app.locals.dataArray = JSON.parse(file); 
    console.log('read the datafile.');
    // console.log(app.locals.dataArray);
  }
  catch(err) {
      console.log('loading data: some error occured: ', err);
      app.locals.dataArray = [];
  }
}
loadData();



app.use(morgan('dev')); // load in development mode.

// check if request is json. if it is json, parse it and add it as req.body object.
app.use(bodyParser.json()); 


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
const port = process.env.PORT;
app.listen(port, function(){
  console.log(`Server listening on port ${port}`);
});


