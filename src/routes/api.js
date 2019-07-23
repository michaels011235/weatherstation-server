const express = require('express');
const router = express.Router();
const fs = require('fs');

// load environment files configuration
require('dotenv').config();
const dataDirectory = process.env.DATADIR;
const dataFile = dataDirectory + '/' + process.env.DATAFILENAME;

// endpoint which is queried by the frontend.
router.get('/data', function(req, res) {
  res.json(req.app.locals.dataArray);
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
    // time checking.
    let checks = [];
    let time = new Date(element.time);
    element.time = time.toUTCString();
    // checks.push(!time.toString() === "Invalid Date");
    checks.push(time > new Date('2019-01-01'));

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
  // now, push it to the other data.
  req.body.forEach((element) => {
    // const time = element.time;
    // const temperature = Number(element.temperature);
    // const humidity = Number(element.humidity);
    
    const singleMeasurementObject = {
      'time': element.time,
      'temperature': element.temperature, 
      'humidity': element.humidity};
    req.app.locals.dataArray.push(singleMeasurementObject);
  });
  
  // save the data to file.
  let jsonData = JSON.stringify(req.app.locals.dataArray);
  fs.writeFile(dataFile, jsonData, 'utf8', (err) => {
    if (err) {
      console.log('there was an while saving the data: ', err);
    }
    else {
      console.log('writing to datafile successful.');
    }
  });


  res.send('got a temperature measurement(s).');

  

});

module.exports = router;