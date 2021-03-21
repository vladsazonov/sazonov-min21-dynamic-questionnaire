const request = require('request');

let interval;

exports.getWeather = (url, io, room) => {
  interval = setInterval(() => {
    request(url, (err, response, body) => {
      if (err) {
        console.log('error:', error);
      } else {
        console.log(JSON.parse(body));
        io.sockets.in(room).emit('weather', JSON.parse(body));
      }
    });
  }, 8000);
};

exports.stopWeatherInterval = () => {
  clearInterval(interval);
};
