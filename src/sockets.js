let io;
const players = {};

const getRandomInt = num => Math.floor(Math.random() * num);

const onJoined = (sock) => {
  const socket = sock;
  socket.join('room1');

  socket.player = {
    pos: {
      x: 600,
      y: 337,
    },
    lastPos: {
      x: 600,
      y: 337,
    },
    lastUpdate: Date.now(),
    hair: getRandomInt(4),
    shirt: getRandomInt(4),
    head: getRandomInt(4),
    shoe: getRandomInt(4),
    number: getRandomInt(100),
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

  socket.on('updatePlayer', (player) => {
    players[socket.id].lastPos = players[socket.id].pos;
    players[socket.id].pos = player.player.pos;
    players[socket.id].lastUpdate = Date.now();
  });
};
const onDisconnect = (sock) => {
  const socket = sock;

  socket.on('disconnect', () => {
    delete players[socket.id];
  });
};

const configure = (ioServer) => {
  io = ioServer;

  setInterval(() => {
    if (players === {} || players === undefined || !players) return;
    io.emit('updatePlayers', players);
  }, 50);
  io.on('connection', (sock) => {
    const socket = sock;
    socket.id = getRandomInt(1000000);

    onJoined(socket);
    onMessage(socket);
    onDisconnect(socket);
  });
};

module.exports.configure = configure;
