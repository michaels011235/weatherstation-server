const express = require('express');
const morgan = require('morgan'); // logging.
const bodyParser = require('body-parser');
const views  = require('./routes/views');
const api = require('./routes/api');
const fs = require('fs');
const sqlite3 = require('sqlite3');
const Database = require('sqlite-async');
require('dotenv').config();

const main = async () => {

  // Instantiate an express object. Typical workflow.
  const app = express();
  
  const dataDirectory = process.env.DATADIR;
  const DBpath = dataDirectory + '/' + process.env.DBfilename;
  
  async function createDatabase() {
    // let db = await new sqlite3.Database(DBpath);
    let db = await Database.open(DBpath);
    await db.run("create table if not exists data (time text, temperature real, humidity real)");
    app.locals.db = db;

    // console.log(`created database ${db}`);
  }
  await createDatabase();
  // console.log('after createDatabase()');
  
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

};

main();


