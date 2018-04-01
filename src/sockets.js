const balls = require('./balls.js');
const doors = require('./doors.js');

let io;
const players = {};

// get a random int between 0 and num
const getRandomInt = num => Math.floor(Math.random() * num);

// called when socket joins
const onJoined = (sock) => {
  const socket = sock;
  socket.join(socket.room);

  // make player object
  socket.player = {
    pos: {
      x: 600,
      y: (675 * (1 / 4)),
    },
    lastPos: {
      x: 600,
      y: (675 * (1 / 4)),
    },
    lastUpdate: Date.now(),
    hair: getRandomInt(4),
    shirt: getRandomInt(4),
    head: getRandomInt(4),
    shoe: getRandomInt(4),
    number: getRandomInt(100),
    room: 'room0',
    id: socket.id,
    change: Date.now(),
  };
  // add player object to list of players in appropriate room
  players[socket.player.room][socket.id] = socket.player;

  // tell the client about their new game
  socket.emit('join', {
    player: socket.id,
    players: players.room0,
    ball: balls.getBalls().room0,
  });
};

// when the socket recieves a message do these
const onMessage = (sock) => {
  const socket = sock;

  // when a player updates the server the server records pertinent information
  socket.on('updatePlayer', (data) => {
    if (players[data.player.room][socket.id] === undefined) return;
    players[data.player.room][socket.id].lastPos = players[data.player.room][socket.id].pos;
    players[data.player.room][socket.id].pos = data.player.pos;
    players[data.player.room][socket.id].lastUpdate = Date.now();
  });
};
// called when socket is disconnected
const onDisconnect = (sock) => {
  const socket = sock;

  socket.on('disconnect', () => {
    // removes appropriate player from list of players
    Object.keys(players).forEach((room) => {
      if (players[room][socket.id] !== undefined) {
        delete players[room][socket.id];
      }
    });
  });
};
// initializes socket
const configure = (ioServer) => {
  io = ioServer;
  // create list of rooms
  for (let i = 0; i < 5; i++) {
    players[`room${i}`] = {};
  }
  // initialize balls
  balls.createBalls();

  // update 10 times a second
  setInterval(() => {
    // update the ball and the balls physics
    balls.updateBalls(players);
    Object.keys(balls.getBalls()).forEach((room) => {
      // checks for gaols
      const ball = balls.getBalls()[room];
      const obj = {
        pos: {
          x: ball.pos.x - 32,
          y: ball.pos.y - 32,
        },
        width: 64,
        height: 64,
        change: ball.change,
      };
      const newRoom = doors.update(obj, room);

      if (newRoom === '') return;

      // tell the users if theres been a goal and reset the ball
      balls.reset(room);
      io.emit('goal', { room, pos: ball.pos });
    });
    // check if players are trying to go to new rooms
    Object.keys(players).forEach((room) => {
      Object.keys(players[room]).forEach((id) => {
        const obj = {
          pos: {
            x: players[room][id].pos.x,
            y: players[room][id].pos.y + 40,
          },
          width: 60,
          height: 20,
          change: players[room][id].change,
        };
        const newRoom = doors.update(obj, room);

        if (newRoom === '') return;

        // if player hit a door then put them in a new room
        const player = players[room][id];
        player.room = newRoom;
        player.change = Date.now();
        players[newRoom][id] = player;
        delete players[room][id];
        io.emit('roomChange', { id, newRoom });
      });
    });

    // finally update client with all the new juicy information we've gathered
    io.emit('updateClient', {
      player: players,
      ball: balls.getBalls(),
    });
  }, 100);
  io.on('connection', (sock) => {
    // give client an id and room
    const socket = sock;
    socket.id = getRandomInt(1000000);
    socket.room = 'room0';

    // organized joined, messages, and disconnect
    onJoined(socket);
    onMessage(socket);
    onDisconnect(socket);
  });
};

// export configuration function.
module.exports.configure = configure;
