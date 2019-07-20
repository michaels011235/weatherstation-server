import requests
import json
import random

random.seed(1)


for i in range(10):
  singleReading = {
    'temperature': random.choice([22,30, 33, 35]),
    'humidity': random.choice([10, 50, 60])
  }

  url = 'http://localhost:3000/api/data/singlereading'

  r = requests.post(url, json=singleReading)

