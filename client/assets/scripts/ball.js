"use strict";

var app = app || {};

app.ball = {

    skip: true,
    speed: 100,
    borderWidth: 118,

    ball: undefined,
    drag: .985,

    init: function () {
        this.ball = {
            pos: {
                x: app.main.WIDTH / 2,
                y: app.main.HEIGHT / 2,
            },
            vel: {
                x: 0,
                y: 0,
            },
            rotation: 0,
        };
    },
    update: function (dt, ctx) {
        if (this.skip) {
            this.skip = false;
            return;
        }
        this.checkCollisions();
        this.updateMovement(dt);
        this.boundBall();

        this.draw(ctx);
    },
    checkCollisions: function () {
        var ball = getProps().ball;
        var ballCollider = {
            pos: {
                x: this.ball.pos.x,
                y: this.ball.pos.y,
            },
            rad: ball.width / 2
        };
        var boxCollider = {
            pos: {
                x: app.player.player.pos.x,
                y: app.player.player.pos.y + 40,
            },
            width: 60,
            height: 20
        }
        if (!BoxSphereCollision(boxCollider, ballCollider)) return
        var myVector = {
            x: 0,
            y: 0
        }

        myVector.x = boxCollider.pos.x - ballCollider.pos.x;
        myVector.y = boxCollider.pos.y - ballCollider.pos.y;
        myVector = normalize(myVector);

        this.ball.vel.x -= myVector.x * this.speed;
        this.ball.vel.y -= myVector.y * this.speed;
    },
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
    updateMovement: function (dt) {
        this.ball.vel.x *= this.drag;
        this.ball.vel.y *= this.drag;

        if (magnitude(this.ball.vel) < 10) {
            this.ball.vel.x = 0;
            this.ball.vel.y = 0;
        }

        this.ball.pos.x += this.ball.vel.x * dt;
        this.ball.pos.y += this.ball.vel.y * dt;
    },
    draw: function (ctx) {
        var ball = getProps().ball;
        var toRad = Math.PI / 180;

        ctx.save();

        var multiplier = 1;
        if(this.ball.vel.x < 0) multiplier = -1;

        this.ball.rotation += ((magnitude(this.ball.vel) * toRad) / (ball.width / 2)) * multiplier;
        ctx.translate(this.ball.pos.x, this.ball.pos.y);
        ctx.rotate(this.ball.rotation);
        ctx.drawImage(ball, -ball.width / 2, -ball.height / 2);

        ctx.restore();
    },
};