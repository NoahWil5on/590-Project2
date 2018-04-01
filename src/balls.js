// gets helper functions
const helper = require('./utilities.js');

// list of all balls
const balls = {};

// ball properties
const speed = 100;
const borderWidth = 118;
const drag = 0.95;
let lastUpdate = Date.now();

// makes balls accessable outsid this file
const getBalls = () => balls;
// creates initial balls when server is set up
const createBalls = () => {
  for (let i = 0; i < 5; i++) {
    balls[`room${i}`] = {
      pos: {
        x: 1200 / 2,
        y: 675 / 2,
      },
      vel: {
        x: 0,
        y: 0,
      },
      change: Date.now(),
    };
  }
};
// resets a ball when a goal is scored
const reset = (room) => {
  balls[room] = {
    pos: {
      x: 1200 / 2,
      y: 675 / 2,
    },
    vel: {
      x: 0,
      y: 0,
    },
    change: Date.now(),
  };
};
// checks if a ball is colliding with a player
const checkBall = (currentBall, player) => {
  const ball = currentBall;

  const ballCollider = {
    pos: {
      x: ball.pos.x,
      y: ball.pos.y,
    },
    rad: 32,
  };
  const boxCollider = {
    pos: {
      x: player.pos.x,
      y: player.pos.y + 40,
    },
    width: 60,
    height: 20,
  };
  if (!helper.BoxSphereCollision(boxCollider, ballCollider)) return currentBall;
  let myVector = {
    x: 0,
    y: 0,
  };
  myVector.x = boxCollider.pos.x - ballCollider.pos.x;
  myVector.y = boxCollider.pos.y - ballCollider.pos.y;

  myVector = helper.normalize(myVector);

  ball.vel.x -= myVector.x * speed;
  ball.vel.y -= myVector.y * speed;

  return ball;
};
// prevents ball from exiting the canvas
const boundBall = (currentBall) => {
  const ball = currentBall;
  if (ball.pos.x < borderWidth) {
    ball.pos.x = borderWidth;
    ball.vel.x *= -1;
  } else if (ball.pos.x > 1200 - borderWidth) {
    ball.pos.x = 1200 - borderWidth;
    ball.vel.x *= -1;
  }
  if (ball.pos.y < borderWidth) {
    ball.pos.y = borderWidth;
    ball.vel.y *= -1;
  } else if (ball.pos.y > 675 - borderWidth) {
    ball.pos.y = 675 - borderWidth;
    ball.vel.y *= -1;
  }

  return ball;
};
// updates movement and speed of ball
const updateMovement = (currentBall, dt) => {
  const ball = currentBall;
  ball.vel.x *= drag;
  ball.vel.y *= drag;

  if (helper.magnitude(ball.vel) < 10) {
    ball.vel.x = 0;
    ball.vel.y = 0;
  }

  ball.pos.x += ball.vel.x * dt;
  ball.pos.y += ball.vel.y * dt;

  return ball;
};
// updates each ball indivually relative to each player
const updateBalls = (players) => {
  Object.keys(balls).forEach((room) => {
    Object.keys(players[room]).forEach((id) => {
      balls[room] = checkBall(balls[room], players[room][id]);
    });
    balls[room] = updateMovement(balls[room], (Date.now() - lastUpdate) / 1000);
    balls[room] = boundBall(balls[room]);
  });
  lastUpdate = Date.now();
};
// exports relevant modules
module.exports = {
  createBalls,
  updateBalls,
  getBalls,
  reset,
};
