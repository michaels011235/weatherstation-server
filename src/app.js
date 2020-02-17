const express = require('express');
const path = require('path');
const morgan = require('morgan'); // logging.
const bodyParser = require('body-parser');
const views  = require('./routes/views');
const api = require('./routes/api');
const fs = require('fs');
const sqlite3 = require('sqlite3');
const Database = require('sqlite-async');
require('dotenv').config();

// the createDatabase function can only be used with an await keyword inside a
// function. So, the main function serves as a container
const main = async () => {

  // Instantiate an express object. Typical workflow.
  const app = express();
  
  // const dataDirectory = process.env.DATADIR;
  // const DBpath = dataDirectory + '/' + process.env.DBfilename;
  const DBPath_env_var = process.env.DBPath;
  console.log(`env variable DBPath: ${DBPath_env_var}`);
  const DBpath = path.join(process.cwd(), process.env.DBPath);
  console.log(`database path: ${DBpath}`);
  
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
  // const plotly_path = path.join(__dirname, '../node_modules/plotly.js-dist/');
  // console.log(plotly_path);
  // app.use('/plotly', express.static(plotly_path));
  // app.use('/plotly', express.static('node_modules/plotly.js-dist/'));
  // console.log(path.join(__dirname, '../public'));

  
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


