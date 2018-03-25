"use strict";

//check collision, poorly named but this is Circle AABB collision
function BoxSphereCollision(box,ball){

    //vector from box to ball
    var point = {
        x: (ball.pos.x - box.pos.x),
        y: (ball.pos.y - box.pos.y)
    }

    //where that point lies on the outer edge of the box
    //(finds the closest point on the box to the ball)
    point.x = Math.max(-box.width / 2, Math.min(box.width / 2, point.x));
    point.y = Math.max(-box.height / 2, Math.min(box.height / 2, point.y));

    //vector of that point to the ball
    point.x += box.pos.x;
    point.y += box.pos.y;

    var mag = magnitude({
        x: point.x - ball.pos.x,
        y: point.y - ball.pos.y
    });
    

    //is the point less than the radius?
    // if(Math.pow(point.x, 2) + Math.pow(point.y, 2) < Math.pow(ball.rad, 2)){
    //     return true;
    // }
    if(mag < ball.rad){
        return true;
    }

    return false;
}
function SphereSphereCollision(ball1, ball2){
    var difference = magnitude({
        x: (ball1.x - ball2.x),
        y: (ball1.y - ball2.y)
    });

    if(difference < (ball1.rad + ball2.rad)) return true;
    return false;
}
//returns mouse position ov given element
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}
//check if a given point is in a given rectangle
function pointInRect(point, rect){
    if(point.x > rect.x && point.x < rect.x + rect.width){
        if(point.y > rect.y && point.y < rect.y + rect.height) return true;
    }
    return false;
}
//interpolate between two numbers
function lerp(s,e,a){
    return s + ((e - s) * a)
}
function magnitude(vec2){
    return Math.sqrt(Math.pow(vec2.x, 2) +  Math.pow(vec2.y, 2));
}
function normalize(vec2){
    var mag = magnitude(vec2);
    if(mag === 0){
        return {
            x: 0,
            y: 0
        };
    }
    return {
        x: vec2.x / mag,
        y: vec2.y / mag
    };
}

//singleton for checking key presses
var Key = {
    //list of pressed keys
    pressed: {},

    //some default keys
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32,
    W: 87,
    A: 65,
    S: 83,
    D: 68,

    //checks whether that "keyCode" is pressed
    isDown: function (keyCode) {
        return this.pressed[keyCode];
    },
    //add key to "pressed"
    onKeydown: function (event) {
        this.pressed[event.keyCode] = true;
    },
    //remove key from "pressed"
    onKeyup: function (event) {
        delete this.pressed[event.keyCode];
    }
};

//keyboard event listeners
window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
