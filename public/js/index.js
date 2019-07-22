const timeDiv = document.getElementById('time');


setInterval(() => {
  const currentTime = new Date(Date.now());

  timeDiv.innerText = currentTime.toUTCString();


}, 500);


let ctx = document.getElementById('chart1');
get(endpoint, {}, (data) => {
  
  const timeArray = data.map(element => { 
    // the plot.ly library is very picky about the format :(
    let time =  new Date(element.time);
    let arr = [time.getFullYear(), time.getMonth(), time.getDay(), 
      time.getHours(), time.getMinutes(), time.getSeconds()];
    let strArr = arr.map((element) => String(element).padStart(2,'0'));
    return `${strArr[0]}-${strArr[1]}-${strArr[2]} ${strArr[3]}:${strArr[4]}:${strArr[5]}`;
  });
   console.log(timeArray);
  const tempArray = data.map(element => element.temperature);
   console.log(tempArray);
  const humArray = data.map(element => element.humidity);
   console.log(humArray);

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
      type: 'date'
    },
    yaxis: {
      title: 'Temperature [°C]',
      autorange: true,
      //range: [86.8700008333, 138.870004167],
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


});



