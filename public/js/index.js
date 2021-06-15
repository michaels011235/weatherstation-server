
// Frontend code
// this code is executed by the browser's Javascript engine.

const timeDiv = document.getElementById('time');
const tempDiv = document.getElementById('temp');
const humDiv = document.getElementById('hum');
const lastTimeDiv = document.getElementById('lastTime');

setInterval(() => {
  const currentTime = new Date(Date.now());
  timeDiv.innerText = currentTime.toLocaleString();
}, 500);

setInterval(() => {
  const data = get_last_data();
  data.then(darr =>{
    console.log(darr[0]);

    let tempValue = darr[0]['temperature'].toFixed(1);
    console.log(tempValue);
    tempDiv.innerText = tempValue;

    let humValue = darr[0]['humidity'].toFixed(1);
    console.log(humValue);
    humDiv.innerText = humValue;

    let lastTimeValue = darr[0]['time'];
    let timeStr =  moment.utc(lastTimeValue, moment.ISO_8601, true).local().format("YYYY-MM-DD HH:mm:ss");
    console.log(timeStr);
    lastTimeDiv.innerText = timeStr;
    

  });
}, 3000);

// console.log(location);

function getTimeArray(data) {
  return data.map(element => 
  { 
    // the plot.ly library is very picky about the format :(
    let time =  moment.utc(element.time, moment.ISO_8601, true);
    // console.log('in getTimeArray: time is:');
    time.local();
    // console.log(time.format());
    // console.log(typeof(time));

    let returnVar = time.format("YYYY-MM-DD HH:mm:ss");


    // console.log('return Variable of getTimeArray is:');
    // console.log(returnVar);
    return returnVar;
  });
}

function plotly(timeArray, tempArray, humArray) {
  let ctx = document.getElementById('chart1');
  let trace1 = {
    type: "scatter",
    mode: "lines",
    name: 'temperature',
    x: timeArray,
    y: tempArray,
    line: {color: '#17BECF'}
  }
  
  let trace2 = {
    type: "scatter",
    mode: "lines",
    name: 'humidity',
    x: timeArray,
    y: humArray,
    yaxis: 'y2',
    line: {color: '#7F7F7F'}
  }
  
  let plotData = [trace1,trace2];
  
  let layout = {
    // title: 'Current Weather Data',

    xaxis: {
      //range: [timeArray[0], timeArray[-1]],
      type: 'date',
      rangeselector: {buttons: [
        {
          count: 1,
          label: '1 min',
          step: 'minute',
          stepmode: 'backward'
        },
        {
          count: 5,
          label: '5 min',
          step: 'minute',
          stepmode: 'backward'
        },
        {
          count: 1,
          label: '1 hour',
          step: 'hour',
          stepmode: 'backward'
        },
        {
          count: 1,
          label: '1 day',
          step: 'day',
          stepmode: 'backward'
        },
        {
          count: 7,
          label: '7 days',
          step: 'day',
          stepmode: 'backward'
        },
        {step: 'all'}
      ]}
    },
    yaxis: {
      title: 'Temperature [°C]',
      autorange: true,
      type: 'linear'
    },
    yaxis2: {
      title: 'Humidity [%]',
      titlefont: {color: '#7F7F7F'},
      tickfont: {color: '#7F7F7F'},
      overlaying: 'y',
      side: 'right'
    }
  };
  Plotly.newPlot(ctx, plotData, layout);

}


async function plot_weather_chart(from_t, to_t) {
  
  let fn_arr = [get_initial_data, get_interval_data];
  let choice;
  if (from_t == null || to_t == null) {
    // const data = get_initial_data(); // a Promise
    choice = 0;
  }
  else {
    // const data = get_interval_data(from_t, to_t); // a Promise
    choice = 1;
  }

  const data = fn_arr[choice](from_t, to_t);
  
  data.then(data => {
    // console.log('just before getTimeArray');
    const timeArray = getTimeArray(data);
    // console.log('Times =');
    // console.log(timeArray);
    const tempArray = data.map(element => element.temperature);
    // console.log(tempArray);
    const humArray = data.map(element => element.humidity);
    // console.log(humArray);
  
    plotly(timeArray, tempArray, humArray);
    let ctx = document.getElementById('chart1');

    ctx.on('plotly_relayout', event => {
      // zoom event.
      console.log('entered - .on event');
      console.log(event);
      if (event['xaxis.range[0]'] || event['xaxis.range[1]']) {
            console.log('inside');
            let interval_start = moment(event['xaxis.range[0]']).toISOString();
            let interval_end = moment(event['xaxis.range[1]']).toISOString();
            console.log('interval', interval_start, interval_end);
            plot_weather_chart(interval_start, interval_end);
      }
      if (event['xaxis.autorange']){
        plot_weather_chart();
      }
    });


  });
}

// actual execution of code.
plot_weather_chart();


