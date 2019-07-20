

const endpoint = 'http://localhost:3000/api/data';


// params is given as a JSON
function get(endpoint, params, successCallback, failureCallback) {
  const xhr = new XMLHttpRequest();
  const fullPath = endpoint ;//+ '?' + formatParams(params);
  xhr.open('GET', fullPath, true);
  xhr.onload = function(err) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        if (successCallback)
          successCallback(JSON.parse(xhr.responseText));
      } else {
        if (failureCallback)
        failureCallback(xhr.statusText);
      }
    }
  };
  xhr.onerror = function(err) {
    failureCallback(xhr.statusText);
  }
  xhr.send(null);
}
