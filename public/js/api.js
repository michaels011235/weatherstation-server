const endpoint = location.origin + '/api/data';



async function get() {
  try {
    let fetchPromise =  await fetch(endpoint);
    if (!fetchPromise.ok) {
      throw Error(fetchPromise.statusText);
    }
    return fetchPromise.json();
  }
  catch (err) {
    console.log('fetch failed', err);
  }
}
