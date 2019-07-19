const express = require('express');
const router = express.Router();


router.get('/', function(req, res) {
  //res.send('Hello World, I tell the weather.');
  //res.send('Hi, you called me at: '+ req.requestTime);
  res.sendFile('index.html', {root: 'src/views'});
});

module.exports = router;