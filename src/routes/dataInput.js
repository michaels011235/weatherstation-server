const express = require('express');
const router = express.Router();


// router.get('/', function(req, res) {
//   const counter = req.app.locals.counter;
//   console.log(counter);
//   res.json({'counter': counter});
// });


// call with
// curl -i -d '{"temp":"37"}' -X POST -H "Content-Type: application/json" localhost:3000/data
router.post('/', function(req, res) {
  console.log(req.body);
  req.app.locals.counter.push(req.body.temp);
  res.send('got a POST request');
});

module.exports = router;