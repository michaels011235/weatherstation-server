const timeDiv = document.getElementById('time');


setInterval(() => {
  const currentTime = new Date(Date.now());

  timeDiv.innerText = currentTime.toUTCString();


}, 500);

const dataDiv = document.getElementById('data');
get(endpoint, {}, (data) => {dataDiv.innerText = JSON.stringify(data);});