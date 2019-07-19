const http = require('http');

const server = http.createServer(function(req, res) {
  res.end("Hello World! I am a weatherstation :).");
});

const port = 3000;
server.listen(port, function(){
  console.log('Server listening on port ' + port);
});

// console.log('Hello World!');