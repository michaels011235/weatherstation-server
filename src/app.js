const express = require('express');
const morgan = require('morgan'); // logging.
const views  = require('./routes/views');


const app = express();
app.use(morgan('dev')); // load in development mode.


// load routes
app.use('/', views);

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
app.use(requestTime);


/* app.get('/', function(req, res){
  //res.send('Hello World, I tell the weather.');
  //res.send('Hi, you called me at: '+ req.requestTime);
  res.sendFile('index.html', {root: 'src/views'});
}); */

app.get('/date', function(req, res) {
  res.json({
    time: req.requestTime
  });
});


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

console.log('Hello World!');