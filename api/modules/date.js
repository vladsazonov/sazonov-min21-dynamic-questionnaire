let interval;

exports.getDate = (io, room) => {
  interval = setInterval(() => {
    io.sockets.in(room).emit('date', Date.now());
  }, 2000);
};

exports.stopDateInterval = () => {
  clearInterval(interval);
};
