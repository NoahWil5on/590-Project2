// imports helper functions
const helper = require('./utilities.js');

// consistent properties around scene
const width = 1200;
const height = 675;
const borderWidth = 118;

// check if a specific door is colliding with an object
const checkDoor = (obj, door) => {
  const box1 = {
    width: 100,
    height: 100,
    pos: {
      x: 0,
      y: 0,
    },
  };
  const box2 = {
    pos: {
      x: obj.pos.x,
      y: obj.pos.y,
    },
    width: obj.width,
    height: obj.height,
  };
    // make box base don which door is being tested
  switch (door) {
    case 'door0':
      box1.pos = {
        x: width / 2,
        y: borderWidth / 2,
      };
      break;
    case 'door1':
      box1.pos = {
        x: width - (borderWidth / 2),
        y: height / 2,
      };
      break;
    case 'door2':
      box1.pos = {
        x: width / 2,
        y: height - (borderWidth / 2),
      };
      break;
    case 'door3':
      box1.pos = {
        x: borderWidth / 2,
        y: height / 2,
      };
      break;
    default:
      break;
  }
  // check if there's been a collision
  if (helper.BoxBoxCollision(box1, box2)) {
    // make sure the collision didn't just happen in the last frame
    if (Date.now() - obj.change > 1000) return true;
  }
  return false;
};
// called from other classes anytime the class wants to check an object collision
// with a goal/door
const update = (obj, room) => {
  // each room has a different set of doors
  switch (room) {
    case 'room0':
      if (checkDoor(obj, 'door0')) return 'room1';
      if (checkDoor(obj, 'door1')) return 'room2';
      if (checkDoor(obj, 'door2')) return 'room3';
      if (checkDoor(obj, 'door3')) return 'room4';
      break;
    case 'room1':
      if (checkDoor(obj, 'door2')) return 'room0';
      break;
    case 'room2':
      if (checkDoor(obj, 'door3')) return 'room0';
      break;
    case 'room3':
      if (checkDoor(obj, 'door0')) return 'room0';
      break;
    case 'room4':
      if (checkDoor(obj, 'door1')) return 'room0';
      break;
    default:
      break;
  }
  return '';
};
// export modules
module.exports = {
  update,
};
