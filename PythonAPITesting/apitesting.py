import json
import datetime
import os
import posixpath

import numpy as np
import requests
from dotenv import load_dotenv

# load Environment variables
load_dotenv(dotenv_path='../.env')
# print(os.getenv('WEATHER_SERVER_URL'))

server_url = os.getenv('WEATHER_SERVER_URL')
server_url = server_url.rstrip('/')
# print(f'server url = {server_url}')

api_endpoint = 'api/data/measurements' # important: no '/' in front
# print(f'api endpoint = {api_endpoint}')

def dummy_sinusoidal_measurements(
  x=None, max_measurement=30, min_measurement=10, omega=1, phase_shift=0):
  '''
  returns a  sinusoidal array
  x shall be a 1-D array of floats or ints
  '''
  if x is None:
    x = np.arange(100)
  shift = (max_measurement + min_measurement) / 2
  amplitude = (max_measurement - min_measurement) / 2
  last_value = x[-1]
  return amplitude * np.cos(x * omega + phase_shift) + shift

def dummy_measurements(
  start_datetime=None,
  time_for_measurements=100, #seconds
  num_measurements = 31,
  min_temp = 10,
  max_temp = 30,
  temp_periods = 1, # how many sinusoidal periods
  temp_phase_shift = 0,
  min_hum = 30,
  max_hum = 80,
  hum_periods = 2,
  hum_phase_shift = - np.pi / 2,
  hum_round_decimals = 1,
  ):
  '''
  '''
  if start_datetime is None:
    start_datetime = datetime.datetime.now(datetime.timezone.utc)
    start_datetime = start_datetime.replace(microsecond=0)
  else:
    assert(isinstance(start_datetime, datetime.datetime))
  
  times = np.linspace(0, time_for_measurements, num_measurements, 
  endpoint=True)
  datetimes = np.array([
    (start_datetime + datetime.timedelta(seconds=time)
    ).isoformat() for time in times
  ])

  # compute temperatures and humidities
  temp_omega = 2 * np.pi / (times[-1] / temp_periods)
  temps = dummy_sinusoidal_measurements(
      x=times,
      max_measurement=max_temp, 
      min_measurement=min_temp, 
      omega=temp_omega, 
      phase_shift=temp_phase_shift)

  hum_omega = 2 * np.pi / (times[-1] / hum_periods)
  hums = dummy_sinusoidal_measurements(
      x=times,
      max_measurement=max_hum, 
      min_measurement=min_hum, 
      omega=hum_omega, 
      phase_shift=hum_phase_shift)


  return (times, datetimes, np.around(temps, decimals=1), 
  np.around(hums, decimals=1))

def single_measurement_request_json(time, temp, hum):
    singlemeasurement = [{
      'time': time,
      'temperature': temp,
      'humidity': hum
    }]
    return singlemeasurement
  


def test_request(datetimes, temps, hums, print_requests=False, print_statuscodes=True):
  '''
  post some test requests to the server
  '''

  url = posixpath.join(server_url, api_endpoint)
  # print(url)

  for time, temp, hum in zip(datetimes, temps, hums):
    singlemeasurement = single_measurement_request_json(time, temp, hum)
    if print_requests:
      print(singlemeasurement)

    r = requests.post(url, json=singlemeasurement)

    if print_statuscodes:
      print(r.text, r.status_code)

