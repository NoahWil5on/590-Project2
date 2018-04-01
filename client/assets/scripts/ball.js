"use strict";

var app = app || {};

//games ball componenet
app.ball = {

    skip: true,
    speed: 100,
    borderWidth: 118,
    myLastUpdate: undefined,
    alpha: .05,
    alplhaModifier: 0,

    ball: undefined,
    lastPos: undefined,
    prevPos: undefined,
    myRotation: 0,

    //create the ball based on response from socket
    init: function (ball) {
        this.ball = ball;
        this.lastPos = ball.pos;
        this.prevPos = ball.pos;

        this.myLastUpdate = Date.now();
        this.alpha = .05;
    },
    //update 60 fps
    update: function (dt, ctx) {
        if(this.alplhaModifier > 0){
            this.alpha += this.alplhaModifier * dt;
        }
        if(this.alpha > 1) this.alpha = 1;

        if (this.skip) {
            this.skip = false;
            return;
        }
        this.updateMovement(dt);
        this.boundBall();

        this.draw(ctx);
    },
    //prevent ball from visual breaking any barriers (does not effect)
    //other clients
    boundBall: function () {
        if (this.ball.pos.x < this.borderWidth) {
            this.ball.pos.x = this.borderWidth;
            this.ball.vel.x *= -1;
        } else if (this.ball.pos.x > app.main.WIDTH - this.borderWidth) {
            this.ball.pos.x = app.main.WIDTH - this.borderWidth;
            this.ball.vel.x *= -1;
        }
        if (this.ball.pos.y < this.borderWidth) {
            this.ball.pos.y = this.borderWidth;
            this.ball.vel.y *= -1;
        } else if (this.ball.pos.y > app.main.HEIGHT - this.borderWidth) {
            this.ball.pos.y = app.main.HEIGHT - this.borderWidth;
            this.ball.vel.y *= -1;
        }
    },
    //get new information about the ball and update lerp information
    updateBallInformation: function (ball){
        var change = (Date.now() - this.myLastUpdate) / 1000;
        if(change > 0) this.alplhaModifier = 1 / change;
        this.alpha = 0.05;
        
        this.prevPos = this.ball.pos;
        this.ball = ball;
        this.ball.dest = {
            x: ball.pos.x + ((ball.pos.x - this.lastPos.x) * change),
            y: ball.pos.y + ((ball.pos.y - this.lastPos.y) * change),
        }
        this.lastPos = ball.pos;
        this.myLastUpdate = Date.now();
    },
    //lerp ball
    updateMovement: function (dt) {
        if(this.ball === undefined || this.ball.dest === undefined ){
            return;
        }

        this.ball.pos.x = lerp(this.prevPos.x, this.ball.dest.x, this.alpha);
        this.ball.pos.y = lerp(this.prevPos.y, this.ball.dest.y, this.alpha);
    },
    //draw ball
    draw: function (ctx) {
        if(this.ball === undefined) return;

        var ball = getProps().ball;
        var toRad = Math.PI / 180;

        ctx.save();

        var multiplier = 1.1;
        if(this.ball.vel.x < 0) multiplier = -1.1;

        //rotate based on speed of ball
        this.myRotation += ((magnitude(this.ball.vel) * toRad) / (ball.width / 2)) * multiplier;
        ctx.translate(this.ball.pos.x, this.ball.pos.y);
        ctx.rotate(this.myRotation);
        ctx.drawImage(ball, -ball.width / 2, -ball.height / 2);

        ctx.restore();
    },
};