let io;
const players = {};

const onJoined = (sock) => {
  const socket = sock;
  socket.join('room1');

  socket.player = {
    lastUpdate: Date.now(),
    pos: {
      x: 0,
      y: 0,
    },
    vel: {
      x: 0,
      y: 0,
    },
    id: socket.id,
  };
  players[socket.id] = socket.player;

  socket.emit('join', {
    player: socket.id,
    players,
  });
};
// when the socket recieves a message do these
const onMessage = (sock) => {
  const socket = sock;

  socket.on('update', (player) => {
    players[socket.id].pos = player.pos;
    players[socket.id].vel = player.vel;
    players[socket.id].lastUpdate = Date.now();
  });
  socket.on('jump', () => {
    players[socket.id].vel.y = -400;
  });
};
const onDisconnect = (sock) => {
  const socket = sock;

  socket.on('disconnect', () => {
  });
};

const configure = (ioServer) => {
  io = ioServer;

  setInterval(() => {
    if (players === {} || players === undefined || !players) return;

    Object.keys(players).forEach((id) => {
      if (players[id] === undefined) return;
      if (players[id].vel.y < 1000) {
        players[id].vel.y += 30;
      }
    });
    io.emit('updatePlayers', players);
  }, 50);

  io.on('connection', (sock) => {
    const socket = sock;
    socket.id = Math.floor(Math.random() * 1000000);

    onJoined(socket);
    onMessage(socket);
    onDisconnect(socket);
  });
};

module.exports.configure = configure;
