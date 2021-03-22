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
        name: 'Кошка',
        value: 'cat'
      },
      {
        name: 'Собака',
        value: 'dog'
      }
    ]
  },
  cat: {
    id: 2,
    title: 'У вас жила когда-нибудь дома кошка?',
    answer: null,
    options: [
      {
        name: 'да',
        value: 'catYes2'
      },
      {
        name: 'нет',
        value: 'catNo2'
      }
    ]
  },
  catYes2: {
    id: 3,
    title: 'Чем вы кормите кошку?',
    answer: null,
    options: [
      {
        name: 'Сухой корм',
        value: 'dryFood3'
      },
      {
        name: 'Натуральная еда',
        value: 'naturalFood3'
      }
    ]
  },
  dryFood3: {
    id: 4,
    title: 'Мой выбор пал на корм потому что...?',
    answer: null,
    options: [
      {
        name: 'недорого',
        value: 'cheap4'
      },
      {
        name: 'полезно для питомца',
        value: 'goodForPet4'
      }
    ]
  },
  cheap4: {
    id: 5,
    title: 'Дешевый корм может навредить здоровью вашего питомца'
  },
  catNo2: {
    id: 6,
    title: 'Вы бы хотели завести кошку?',
    answer: null,
    options: [
      {
        name: 'Да',
        value: 'catYes6'
      },
      {
        name: 'нет',
        value: 'catNo6'
      }
    ]
  },
  catYes6: {
    id: 7,
    title: 'Где бы вы искали питомца?',
    answer: null,
    options: [
      {
        name: 'В питомнике/на рынке',
        value: 'nurseryOrMarket7'
      },
      {
        name: 'В приюте/подобрал на улице',
        value: 'shelterOrStreet7'
      }
    ]
  },
  nurseryOrMarket7: {
    id: 8,
    title: 'Вы бы взяли кошку с питомника/на рынке потому что ...? ( выберете один из важных на ваш взгляд критериев)',
    answer: null,
    options: [
      {
        name: 'Хочу породистую кошку',
        value: 'wantThoroughbredCat8'
      },
      {
        name: 'Большой выбор',
        value: 'wideSelection8'
      }
    ]
  },
  wantThoroughbredCat8: {
    id: 9,
    title: 'Хороший выбор, но учтите что породистые кошки стоят немалых денег'
  },
  wideSelection8: {
    id: 9,
    title: 'Вы правы, на рынке очень большой выбор питомцев на разный вкус и цвет'
  },
  goodForPet4: {
    id: 10,
    title:
      'Дорогие корма действительно хорошо влияют на здоровье питомца, но не забывайте иногда комбинировать сухие и влажные корма'
  },
  naturalFood3: {
    id: 11,
    title: 'Мой выбор пал на натуральную еду потому что...',
    answer: null,
    options: [
      {
        name: 'недорого',
        value: 'cheap11'
      },
      {
        name: 'полезно для питомца',
        value: 'goodForPet11'
      }
    ]
  },
  cheap11: {
    id: 12,
    title:
      'Это верно, но некоторые породы кошек плохо переваривают натуральную еду, перед составлением рациона кошки проконсультируйтесь с ветеринаром'
  },
  goodForPet11: {
    id: 13,
    title:
      'Это не совсем верно, некоторые породы кошек плохо переваривают натуральную еду, перед составлением рациона кошки проконсультируйтесь с ветеринаром'
  },
  catNo6: {
    id: 14,
    title: 'Почему?',
    answer: null,
    options: [
      {
        name: 'начинается аллергия',
        value: 'allergiesStart14'
      },
      {
        name: 'Нет желания',
        value: 'noDesire14'
      }
    ]
  },
  allergiesStart14: {
    id: 15,
    title: 'Вам действительно не стоит заводить любое домашнее животное, так как это опасно для вашего здоровья'
  },
  noDesire14: {
    id: 16,
    title: 'Возможно вам стоит задумать об этом позже'
  },
  shelterOrStreet7: {
    id: 17,
    title:
      'Вы бы взяли кошку с приюта/подобрал на улице потому что ...? ( выберете один из важных на ваш взгляд критериев)',
    answer: null,
    options: [
      {
        name: 'Не могу купить, но очень хочу завести кошку',
        value: 'cantByuButWant17'
      },
      {
        name: 'Это благородно',
        value: 'noble17'
      }
    ]
  },
  cantByuButWant17: {
    id: 18,
    title: 'Правильное решение, таким образом можно завести любящего питомца за небольшую сумму'
  },
  noble17: {
    id: 19,
    title: 'Абсолютно верно, этим поступком вы сохраните одну маленькую жизнь'
  },
  dog: {
    id: 20,
    title: 'У вас жила когда-нибудь дома собака?',
    answer: null,
    options: [
      {
        name: 'да',
        value: 'dogYes20'
      },
      {
        name: 'нет',
        value: 'dogNo20'
      }
    ]
  },
  dogYes20: {
    id: 21,
    title: 'Чем вы кормили собаку?',
    answer: null,
    options: [
      {
        name: 'Сухой корм',
        value: 'dryFood21'
      },
      {
        name: 'Натуральная еда',
        value: 'naturalFood21'
      }
    ]
  },
  dryFood21: {
    id: 22,
    title: 'Мой выбор пал на корм потому что...?',
    answer: null,
    options: [
      {
        name: 'недорого',
        value: 'cheap22'
      },
      {
        name: 'полезно для питомца',
        value: 'goodForPet22'
      }
    ]
  },
  naturalFood21: {
    id: 23,
    title: 'Мой выбор пал на натуральную еду потому что...',
    answer: null,
    options: [
      {
        name: 'недорого',
        value: 'cheap23'
      },
      {
        name: 'полезно для питомца',
        value: 'goodForPet23'
      }
    ]
  },
  cheap23: {
    id: 24,
    title:
      'Это верно, но некоторые породы собак плохо переваривают натуральную еду, перед составлением рациона собаки проконсультируйтесь с ветеринаром'
  },
  goodForPet23: {
    id: 25,
    title:
      'Это не совсем верно, некоторые породы собак плохо переваривают натуральную еду, перед составлением рациона собаки проконсультируйтесь с ветеринаром'
  },
  cheap22: {
    id: 26,
    title: 'Дешевый корм может навредить здоровью вашего питомца'
  },
  goodForPet22: {
    id: 27,
    title:
      'Дорогие корма действительно хорошо влияют на здоровье питомца, но не забывайте иногда комбинировать сухие и влажные корма'
  },
  dogNo20: {
    id: 28,
    title: 'А хотели бы завести собаку?',
    answer: null,
    options: [
      {
        name: 'Да',
        value: 'dogYes28'
      },
      {
        name: 'нет',
        value: 'dogNo28'
      }
    ]
  },
  dogNo28: {
    id: 29,
    title: 'Почему?',
    answer: null,
    options: [
      {
        name: 'начинается аллергия',
        value: 'allergiesStart29'
      },
      {
        name: 'Нет желания',
        value: 'noDesire29'
      }
    ]
  },
  allergiesStart29: {
    id: 30,
    title: 'Вам действительно не стоит заводить любое домашнее животное, так как это опасно для вашего здоровья'
  },
  noDesire29: {
    id: 31,
    title: 'Возможно вам стоит задумать об этом позже'
  },
  dogYes28: {
    id: 32,
    title: 'Тогда действуйте!'
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

  if (authUserIndex !== -1) {
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
