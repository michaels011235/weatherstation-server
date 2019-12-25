const timeDiv = document.getElementById('time');

setInterval(() => {
  const currentTime = new Date(Date.now());
  timeDiv.innerText = currentTime.toLocaleString();
}, 500);

// console.log(location);

function getTimeArray(data) {
  return data.map(element => 
  { 
    // the plot.ly library is very picky about the format :(
    let time =  new Date(element.time);
    // console.log('in getTimeArray: time is:');
    // console.log(time);
    // console.log(typeof(time));
    let arr = [
      time.getFullYear(), 
      time.getMonth()+1, // js starts enumerating the months with 0.
      time.getDate(), 
      time.getHours(), time.getMinutes(), time.getSeconds()];
    // console.log('in getTimeArray: variable arr:');
    // console.log(arr)

    let strArr = arr.map((element) => String(element).padStart(2,'0'));
    let returnVar = `${strArr[0]}-${strArr[1]}-${strArr[2]} ${strArr[3]}:${strArr[4]}:${strArr[5]}`;
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
  Plotly.newPlot('chart1', plotData, layout);
}


const data = get(); // a Promise
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
});

// const d = data.then(data => {
//   return data[0];
// });

// const t = d.then(d => {
//   return d.time;
// });

// t.then(t => {
//   console.log(t);
//   console.log(typeof(t));
// });