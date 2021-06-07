# weatherstation-server

A very simple weatherstation app. This repository contains the code for the server. 
It opens a website at `SERVER:PORT` for example `localhost:3000`. You can ommit the 
`PORT` if the port is set to 80.  

A Raspberry Pi or something equivalent can send HTTP - requests with new data to the server.

The POST requests to the server must be HTTP POST requests in JSON format 
to`SERVER:PORT/api/data/measurements`. These requests must have the form:

```
[
  { 
    time': time,
    'temperature': temp,
    'humidity': hum
  },
  {
    ... another measurement
  }
]
```

`time` is a ISO 8601 timestring, `temp` and `hum` are an integer or float. If
`time` does not have a timezone information, it will be treated as UTC.

## Installation

### Prerequisites

- `npm` - for the server.

-  just in case you want to test the server: `Python`, and 2 external libraries: `requests`, `numpy`.

### Server

- The following works for a plain Ubuntu 20.04 (at least as of June 2021).

- The following steps take place in a terminal. Open a terminal emulator.

- git clone the source code.

- change to the project directory.

- change the name of the file `.env.example` to `.env` and adapt it if neccessary. This file contains the configuration.

- `npm install`

- `npm run start-development` This runs the script `start` as defined in `package.json`. This is just for testing purposes. 

If you want to run it in production mode:

- `npm run start`.

It can be read in `package.json` in the `scripts` section but for convenience and new nodejs users:
The code will start at `/src/app.js`.

Important: If you want to run the server on Port 80, you have to use `sudo npm run start`. `sudo` uses the `root` user to execute the command.
Only `root` can access port 80.

### Testing the server

- change the directory to `PythonAPITesting`. 

- configure the `server_url` variable in `apitesting.py` if neccessary.

- open a `python3` interpreter.

- `import apitesting`.

- one use case is running `apitesting.test_fn()`.