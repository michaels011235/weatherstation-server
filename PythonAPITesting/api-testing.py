import requests
import json
import random
import numpy as np
import datetime
random.seed(1)

number_of_measurements = 100
assert(number_of_measurements > 1) # otherwise in the calculation
# of omega, there would be an DivisionByZero exception.
time_for_measurements = 100 # seconds

min_temp = 10
max_temp = 30
temp_periods = 1
temp_phase_shift = 0
temp_round_decimals = 1

min_hum = 30
max_hum = 80
hum_periods = 2
hum_phase_shift = - np.pi / 2
hum_round_decimals = 1

times = np.linspace(0, time_for_measurements, number_of_measurements, endpoint=False)
print(times)

current_time = datetime.datetime.now(datetime.timezone.utc)
current_time = current_time.replace(microsecond=0)
print(current_time.isoformat())
datetimes = np.array([
  (current_time + datetime.timedelta(seconds=time)).isoformat() for time in times
])
# print(datetimes)

def sinusoidal(times_arr, max_measurement, min_measurement, periods, phase_shift):
  '''
  returns sinusoidal array
  '''
  shift = (max_measurement + min_measurement) / 2
  amplitude = (max_measurement - min_measurement) / 2
  last_value = times_arr[-1]
  omega = 2 * np.pi * temp_periods / last_value
  return amplitude * np.cos(times_arr * omega + phase_shift) + shift

temperatures = sinusoidal(times, max_temp, min_temp, 
    temp_periods, temp_phase_shift).round(decimals=temp_round_decimals)
# print(temperatures)

humidities  = sinusoidal(times, max_hum, min_hum, 
    hum_periods, hum_phase_shift).round(decimals=hum_round_decimals)
# print(humidities)

for time, temp, hum in zip(datetimes, temperatures, humidities):
  singlemeasurement = [{
    'time': time,
    'temperature': temp,
    'humidity': hum
  }]
  # print(singlemeasurement)

  url = 'http://localhost:3000/api/data/measurements'

  r = requests.post(url, json=singlemeasurement)
  print(r.text, r.status_code)
