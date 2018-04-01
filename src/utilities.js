// get magnitude of a 2d vector
const magnitude = vec2 => Math.sqrt((vec2.x * vec2.x) + (vec2.y * vec2.y));
// check collision, poorly named but this is Circle AABB collision
const BoxSphereCollision = (box, ball) => {
  // vector from box to ball
  const point = {
    x: (ball.pos.x - box.pos.x),
    y: (ball.pos.y - box.pos.y),
  };

    // where that point lies on the outer edge of the box
    // (finds the closest point on the box to the ball)
  point.x = Math.max(-box.width / 2, Math.min(box.width / 2, point.x));
  point.y = Math.max(-box.height / 2, Math.min(box.height / 2, point.y));

  // vector of that point to the ball
  point.x += box.pos.x;
  point.y += box.pos.y;

  const mag = magnitude({
    x: point.x - ball.pos.x,
    y: point.y - ball.pos.y,
  });

    // is the point less than the radius?
  if (mag < ball.rad) {
    return true;
  }

  return false;
};
// get magnitude of vector
const normalize = (vec2) => {
  const mag = magnitude(vec2);
  if (mag === 0) {
    return {
      x: 0,
      y: 0,
    };
  }
  return {
    x: vec2.x / mag,
    y: vec2.y / mag,
  };
};
// check collision between two boxes
const BoxBoxCollision = (box1, box2) => {
  if (box1.pos.x - (box1.width / 2) < box2.pos.x + box2.width &&
        box2.pos.x < box1.pos.x + (box1.width / 2)) {
    if (box1.pos.y - (box1.height / 2) < box2.pos.y + box2.height &&
                box2.pos.y < box1.pos.y + (box1.height / 2)) {
      return true;
    }
  }
  return false;
};
// exports modoules
module.exports = {
  BoxSphereCollision,
  BoxBoxCollision,
  magnitude,
  normalize,
};
