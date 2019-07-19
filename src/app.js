const express = require('express');


const app = express();



app.use('/static', express.static('public'));

app.get('/', function(req, res){
  //res.send('Hello World, I tell the weather.');
  res.sendFile('index.html', {root: 'src/views'});
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