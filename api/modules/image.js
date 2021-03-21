let interval;

exports.sendImage = (i, io, room) => {
  interval = setInterval(() => {
    i++;

    switch (i) {
      case 10: {
        io.sockets.in(room).emit('image', 'raccoon');
        setTimeout(() => {
          io.sockets.in(room).emit('image', '');
        }, 5000);
        break;
      }
      case 30: {
        io.sockets.in(room).emit('image', 'fox');
        setTimeout(() => {
          io.sockets.in(room).emit('image', '');
        }, 5000);
        break;
      }
      case 50: {
        io.sockets.in(room).emit('image', 'hamster');
        setTimeout(() => {
          io.sockets.in(room).emit('image', '');
        }, 5000);
        break;
      }
      case 60: {
        i = 0;
        break;
      }
    }
  }, 1000);
};

exports.stopImageInterval = () => {
  clearInterval(interval);
};
