const express = require('express');
const router = express.Router();

router.get('/data', function(req, res) {
  res.json(req.app.locals.dataArray);
});

router.post('/data/singlereading', function(req, res) {
  const time = req.body.time;
  const temperature = Number(req.body.temperature);
  const humidity = Number(req.body.humidity);
  
  const singleReadingObject = {
    'time': time,
    'temperature': temperature, 
    'humidity': humidity};
  req.app.locals.dataArray.push(singleReadingObject);
  res.send('got a temperature reading.');
});

module.exports = router;