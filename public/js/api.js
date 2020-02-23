
const data_endpoint = location.origin + '/api/data';
const initial_data_endpoint = location.origin + '/api/initialdata';
const interval_data_endpoint = location.origin + '/api/intervaldata';



async function get_data() {
  try {
    let fetchPromise =  await fetch(data_endpoint);
    if (!fetchPromise.ok) {
      throw Error(fetchPromise.statusText);
    }
    return fetchPromise.json();
  }
  catch (err) {
    console.log('fetch failed', err);
  }
}



async function get_initial_data() {
  try {
    let fetchPromise =  await fetch(initial_data_endpoint);
    if (!fetchPromise.ok) {
      throw Error(fetchPromise.statusText);
    }
    return fetchPromise.json();
  }
  catch (err) {
    console.log('fetch failed', err);
  }
}

async function get_interval_data(from_t, to_t) {
  try {
    let data = {"from_time": from_t, "to_time": to_t};
    let fetchPromise =  await fetch(
      interval_data_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) }
      );
    
    

    if (!fetchPromise.ok) {
      throw Error(fetchPromise.statusText);
    }
    return fetchPromise.json();
  }
  catch (err) {
    console.log('fetch failed', err);
  }
}
