const bodyParser = require('body-parser');
const crypto = require('crypto');
const express = require('express');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
});

const imageModule = require('./modules/image');
const weatherModule = require('./modules/weather');
const dateModule = require('./modules/date');
const scheduleModule = require('./modules/schedule');

const users = [{ email: '1@1.ru', password: '123', id: '1' }];
const authUsers = [];

const apiKey = '3002d67cb8a320168061e244695ed009';
const city = 'rostov-on-don';
const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

io.on('connection', socket => {
  console.log('socket connected');

  socket.on('disconnect', () => {
    console.log('socket disconnected');

    weatherModule.stopWeatherInterval();

    imageModule.stopImageInterval();

    dateModule.stopDateInterval();
  });

  socket.on('joinRoom', room => {
    if (!io.sockets.adapter.rooms.get(room)) {
      socket.join(room);
    }

    let i = 0;

    imageModule.sendImage(i, io, room);

    dateModule.getDate(io, room);

    weatherModule.getWeather(url, io, room);

    scheduleModule.getSchedule(io, room);
  });

  socket.on('leaveRoom', room => {
    socket.leave(room);

    weatherModule.stopWeatherInterval();

    imageModule.stopImageInterval();

    dateModule.stopDateInterval();
  });
});

app.use(bodyParser.json());
app.use(express.static(process.cwd() + '/is/dist/is/'));

app.post('/api/login', (req, res) => {
  const user = users.find(user => user.email === req.body.email && user.password === req.body.password);

  if (user) {
    const isUserAuthed = authUsers.some(authUser => user.email === authUser.email);

    if (!isUserAuthed) {
      authUsers.push(user);
      res.json(user);
    } else {
      res.status(422).send('user already authorized');
    }
  } else {
    res.status(422).send('wrong email or password');
  }
});

app.post('/api/register', (req, res) => {
  const newUser = { email: req.body.email, password: req.body.password, id: crypto.randomBytes(16).toString('hex') };

  const isUserExists = users.some(user => user.email === newUser.email);

  if (!isUserExists) {
    users.push(newUser);
    res.json('user added');
  } else {
    res.status(422).send('user already exists');
  }
});

app.post('/api/checkSession', (req, res) => {
  const isUserAuthed = authUsers.some(user => user.id === req.body.userId);

  res.json(JSON.parse(isUserAuthed));
});

app.post('/api/logout', (req, res) => {
  const authUserIndex = authUsers.findIndex(user => user.id === req.body.userId);

  if (authUserIndex) {
    authUsers.splice(authUserIndex, 1);
  }

  res.json('ok');
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/is/index.html'));
});

http.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on the port`);
});
