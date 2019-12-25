const express = require('express');
const router = express.Router();
const fs = require('fs');
const moment = require('moment');

// endpoint which is queried by the frontend.
router.get('/data', async function(req, res) {
  let data = await req.app.locals.db.all('select * from data order by time asc');
  // console.log(data);
  // console.log(typeof(data));
  res.json(data);
});


// Implement API Endpoint for getting new measurements.
const measurements = '/data/measurements';

// define own error class
class measurementInputError extends Error {}

// measurement middleware
function measurementMiddleware(req, res, next) {
  // shall validate the measurement request.

  // test if there is a JSON request with the correct format
  // shall accept arrays of objects consisting of a time, temperature
  // and humidity property
  const arr = req.body;
  if (! Array.isArray(arr)) {
    throw new measurementInputError('not an Array');
  }

  // check each measurement.
  function check_measurement(element) {
    let checks = [];
    // time checking.
    // print the input time
    // console.log('Request: element.time is:')
    // console.log(element.time);
    // console.log(typeof(element.time));

    let time = moment.utc(element.time).toISOString();
    element.time = time;
    // checks.push(!time.toString() === "Invalid Date");
    //checks.push(time > new Date('2019-01-01'));

    let temp = Number(element.temperature);
    checks.push(temp > -50 && temp < 70);
    element.temperature = temp;
    
    let hum = Number(element.humidity);
    checks.push(hum >= 0 && hum <= 100);
    element.humidity = hum;

    if (checks.some((element) => {return element === false;})) {
      throw new measurementInputError('invalid measurement:' + JSON.stringify(element));
    }
  }
  arr.forEach(check_measurement); // would throw an error.

  // call next() at the end to process the request further.
  next()
}

// use the middleware just for the measurements path
router.post(measurements, measurementMiddleware);

router.post(measurements, function(req, res) {
  // so using the middleware we already checked that the input is valid.
  req.body.forEach((element) => {
    
    const singleMeasurementObject = {
      'time': element.time,
      'temperature': element.temperature, 
      'humidity': element.humidity};

    req.app.locals.db.run("insert into data values (?,?,?)", element.time, element.temperature, element.humidity);
    console.log('inserted into db');
  });
  
  res.send('got (a) temperature measurement(s).');

});

module.exports = router;