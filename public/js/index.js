
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


