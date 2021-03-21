exports.getSchedule = (io, room) => {
  setTimeout(() => {
    const currentDate = new Date();
    const startDate = new Date();
    const endDate = new Date();

    if (currentDate >= startDate.setHours(8, 30) && currentDate <= endDate.setHours(9, 50)) {
      io.sockets.in(room).emit('schedule', 'Время бодрых');
    }

    if (currentDate >= startDate.setHours(10, 5) && currentDate <= endDate.setHours(10, 15)) {
      io.sockets.in(room).emit('schedule', 'Пора завтракать');
    }

    if (currentDate >= startDate.setHours(10, 16) && currentDate <= endDate.setHours(11, 50)) {
      io.sockets.in(room).emit('schedule', 'Снова учеба');
    }

    if (currentDate >= startDate.setHours(11, 51) && currentDate <= endDate.setHours(12, 0)) {
      io.sockets.in(room).emit('schedule', 'Хочу домой, но пара впереди');
    }

    if (currentDate >= startDate.setHours(12, 1) && currentDate <= endDate.setHours(13, 35)) {
      io.sockets.in(room).emit('schedule', 'Ученье свет');
    }

    if (currentDate >= startDate.setHours(13, 36) && currentDate <= endDate.setHours(14, 15)) {
      io.sockets.in(room).emit('schedule', 'Ура! Вот теперь-то заживем!');
    }

    if (currentDate >= startDate.setHours(14, 16)) {
      io.sockets.in(room).emit('schedule', 'Зайдите в другое время');
    }
  }, 2000);
};
