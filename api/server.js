const bodyParser = require('body-parser');
const crypto = require('crypto');
const express = require('express');

const app = require('express')();
const http = require('http').Server(app);

const users = [
  { email: '1@1.ru', password: '123', id: '1' },
  { email: 'admin@oz.ru', password: 'qwerty123', id: '2' }
];
const authUsers = [];

const questions = {
  main: {
    id: 1,
    title: 'Выберите животное которое нравится вам больше всего',
    answer: null,
    options: [
      {
        id: 11,
        name: 'Кошка',
        value: 'cat'
      },
      {
        id: 12,
        name: 'Собака',
        value: 'dog'
      }
    ]
  },
  dog: {
    id: 2,
    title: 'У вас жила когда-нибудь дома собака?',
    answer: null,
    options: [
      {
        id: 21,
        name: 'да',
        value: 'yes2'
      },
      {
        id: 22,
        name: 'нет',
        value: 'no2'
      }
    ]
  },
  cat: {
    id: 3,
    title: 'У вас жила когда-нибудь дома кошка?',
    answer: null,
    options: [
      {
        id: 31,
        name: 'да',
        value: 'yes3'
      },
      {
        id: 32,
        name: 'нет',
        value: 'no3'
      }
    ]
  },
  yes3: {
    id: 4,
    title: 'Чем вы кормите кошку?',
    answer: null,
    options: [
      {
        id: 41,
        name: 'Сухой корм',
        value: 'yes4'
      },
      {
        id: 42,
        name: 'Натуральная еда',
        value: 'no4'
      }
    ]
  },
  no3: {
    id: 5,
    title: 'Вы бы хотели завести кошку?',
    answer: null,
    options: [
      {
        id: 41,
        name: 'Да',
        value: 'yes5'
      },
      {
        id: 42,
        name: 'нет',
        value: 'no5'
      }
    ]
  }
};

app.use(bodyParser.json());
app.use(express.static(process.cwd() + '/is/dist/is/'));

app.get('/api/questions', (req, res) => {
  res.json(questions);
});

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
