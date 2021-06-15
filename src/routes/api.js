const express = require('express');
const router = express.Router();
const fs = require('fs');
const moment = require('moment');

// frontend
router.get('/lastdata', async function(req, res) {
    let data = await req.app.locals.db.all('SELECT * FROM data ORDER BY time desc LIMIT 1');
    // console.log(data);
    // console.log(typeof(data));
    res.json(data);
  });

// frontend
router.get('/data', async function(req, res) {
  let data = await req.app.locals.db.all('select * from data order by time asc');
  // console.log(data);
  // console.log(typeof(data));
  res.json(data);
});

function nPoints(arr, n) {
  if (arr.length > n) {
    const natural_numbers = [];
    for (let i = 0; i < n; i++) {
      natural_numbers.push(i);
    }

    const points = natural_numbers.map(num => arr[Math.round(num* (arr.length / n))]);
    return points;
  }
  else {return arr;}

}

// frontend
router.get('/initialdata', async function(req, res) {
  let data = await req.app.locals.db.all('select * from data order by time asc');
  const n_rows = 5000; // plotting takes time, so only 5000 rows at max.
  const plotData = nPoints(data, n_rows);

  // console.log(data);
  // console.log(typeof(data));
  res.json(plotData);
});

function intervalDataMiddleware(req, res, next) {
  //
  // accepts a get request with a JSON body of the form:
  // { 
    // "from_time": "ISO-8601 string", // without timezone: interpreted as UTC
    // "to_time": "ISO-8601 string"
  // }
  //
  const interval = req.body;

  // input validation
  const from_time_m = moment.utc(interval.from_time, moment.ISO_8601, true);
  const to_time_m  = moment.utc(interval.to_time, moment.ISO_8601, true);
  try{
    let correct = from_time_m.isValid() && to_time_m.isValid();
    if (!correct) {
      throw new Error('input error');
    }
    req.from_time = from_time_m.toISOString();
    req.to_time = to_time_m.toISOString();
    next()
  }
  catch(err) {
    next(err)
  }
  finally {
    console.log('original input:');
    console.log({'from': interval.from_time, 'to': interval.to_time});
    console.log('SQL query input:');
    console.log({'from': from_time_m.toISOString(), 'to': to_time_m.toISOString()});
  }
}

router.post('/intervaldata', intervalDataMiddleware);

router.post('/intervaldata', async function(req, res) {
  let data = await req.app.locals.db.all(
        'select * from data where time > ? and time < ? order by time asc', 
        req.from_time, req.to_time);

  const n_rows = 5000; // plotting takes time, so only 5000 rows at max.
  const plotData = nPoints(data, n_rows);

  // console.log(data);
  // console.log(typeof(data));
  res.json(plotData);
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

    let time = moment.utc(element.time);
    checks.push(time.isValid());
    element.time = time.toISOString();
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
    console.log(`inserted into db: ${JSON.stringify(singleMeasurementObject)}`);
  });
  
  res.send('got (a) temperature measurement(s).');

});

module.exports = router;