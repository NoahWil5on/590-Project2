"use strict";

var app = app || {};

app.player = {

    skip: true,
    player: undefined,
    players: undefined,
    playersAnimation: {},

    maxSpeed: 150,

    init: function (player, players) {
        this.players = players;

        this.player = players[player];
        this.player.pos = {
            x: app.main.WIDTH / 2,
            y: app.main.HEIGHT * (1 / 4),
        };
        this.player.vel = {
            x: 0,
            y: 0,
        };
        this.player.animationVal = 0;
        this.player.reflect = false;

        // this.players = players;

        // this.player = players[id];
        // this.player.width = 60;
        // this.player.height = 81;
    },
    update: function (dt, ctx) {
        if (this.skip) {
            this.skip = false;
            return;
        }
        this.updatePlayers(dt);
        this.updateMovement(dt);
        this.boundPlayer();

        this.draw(ctx);
    },
    updatePlayers: function(dt){
        Object.keys(this.players).forEach((id) => {
            if(this.player.id === this.players[id].id || this.players[id] === undefined) return;

            var player = this.players[id];
            if(this.playersAnimation[id] === undefined){
                this.playersAnimation[id] = {
                    animationVal: 0,
                    reflect: false,
                    moving: false,
                };
            }
            if(player.pos.x !== player.lastPos.x ||
                player.pos.y !== player.lastPos.y){
                this.playersAnimation[id].animationVal += dt * 15;
                this.playersAnimation[id].moving = true;
            }else{
                this.playersAnimation[id].animationVal = 0;
                this.playersAnimation[id].moving = false;
            }
            if(player.lastPos.x < player.pos.x){
                this.playersAnimation[id].reflect = true;
            }else if(player.lastPos.x > player.pos.x){
                this.playersAnimation[id].reflect = false;
            }
            this.players[id].animationVal = this.playersAnimation[id].animationVal; 
            this.players[id].reflect = this.playersAnimation[id].reflect;            
            this.players[id].moving = this.playersAnimation[id].moving;  
        });
    },
    boundPlayer: function(){
        if(this.player.pos.x < 100){
            this.player.pos.x = 100;
        }else if(this.player.pos.x > app.main.WIDTH - 100){
            this.player.pos.x = app.main.WIDTH - 100;
        }
        if(this.player.pos.y < 50){
            this.player.pos.y = 50;
        }else if(this.player.pos.y > app.main.HEIGHT - 140){
            this.player.pos.y = app.main.HEIGHT - 140;
        }
    },
    updateMovement: function (dt) {
        this.player.vel = {
            x: 0,
            y: 0
        }
        if (Key.isDown(Key.LEFT)) {
            this.player.reflect = false;
            this.player.vel.x = -1
        }
        if (Key.isDown(Key.RIGHT)) {
            this.player.reflect = true;
            this.player.vel.x = 1
        }
        if (Key.isDown(Key.UP)) {
            this.player.vel.y = -1
        }
        if (Key.isDown(Key.DOWN)) {
            this.player.vel.y = 1
        }

        this.player.vel = normalize(this.player.vel);
        this.player.pos.x += this.player.vel.x * dt * this.maxSpeed;
        this.player.pos.y += this.player.vel.y * dt * this.maxSpeed;

        if (this.player.vel.y !== 0 ||
            this.player.vel.x !== 0) {
            this.player.moving = true;
            this.player.animationVal += dt * 15;
        } else {
            this.player.moving = false;
            this.player.animationVal = 0;
        }
    },
    draw: function (ctx) {
        Object.keys(this.players).forEach((id) => {
            if(this.player.id === this.players[id].id || this.players[id] === undefined) return;
            this.drawPlayer(ctx, this.players[id]);            
        });
        this.drawPlayer(ctx, this.player);
    },
    drawPlayer: function (ctx, player) {
        var shirt = getShirt(player.shirt);
        var head = getHead(player.head);
        var shoe = getShoe(player.shoe);
        var hair = getHair(player.hair);
        var eyes = getEyes();

        ctx.save();

        ctx.translate(player.pos.x, player.pos.y);
        if (player.reflect) {
            ctx.scale(-1, 1);
        }
        this.drawShoes(ctx, player, shoe);
        ctx.drawImage(
            shirt,
            -shirt.width / 2,
            -shirt.height / 2);
        ctx.drawImage(
            head,
            -head.width / 2,
            -head.height / 2 - 52);
        ctx.drawImage(
            hair,
            -hair.width / 2,
            -hair.height / 2 - 83);
        ctx.drawImage(
            eyes,
            -eyes.width / 2,
            -eyes.height / 2 - 68);

        if (player.reflect) {
            ctx.scale(-1, 1);
        }
        this.drawNumber(ctx, player);


        ctx.restore();
    },
    drawNumber: function (ctx, player) {
        ctx.save();

        ctx.strokeStyle = "black";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "20px Nova Mono";
        ctx.lineWidth = 4;

        ctx.strokeText(
            player.number + "", 0, 5);
        ctx.fillText(
            player.number + "", 0, 5);

        ctx.restore();
    },
    drawShoes: function (ctx, player, shoe) {
        ctx.save();

        var offsetX = 0;
        var offsetY_01 = 0;
        var offsetY_02 = 0;

        if (player.moving) {
            console.log(player.animationVal);
            offsetX = Math.sin(player.animationVal) * 8;
            offsetY_01 = Math.cos(player.animationVal) * 8;
            offsetY_02 = Math.cos(player.animationVal + Math.PI) * 5;

            if (offsetY_01 > 0) offsetY_01 = 0;
            if (offsetY_02 > 0) offsetY_02 = 0;
        }
        ctx.drawImage(
            shoe,
            -shoe.width / 2 - 16 + offsetX,
            -shoe.height / 2 + 38 + offsetY_01);
        ctx.drawImage(
            shoe,
            -shoe.width / 2 + 6 + -offsetX,
            -shoe.height / 2 + 42 + offsetY_02);

        ctx.restore()
    }
    // interpolatePositions: function(){

    //     Object.keys(this.players).forEach(id => {
    //         if(id === this.player.id) return;
    //         player = this.players[id];

    //         dt = (Date.now() - player.lastUpdate) / 1000;

    //         player.dest = {
    //             x: player.pos.x + player.vel.x * dt,
    //             y: player.pos.y + player.vel.y * dt
    //         };
    //         player.alpha = 

    //         player.pos.x = lerp()
    //     })
    //     //other player
    //     this.player2.pos.x = lerp(this.player2.lastPos.x, this.player2.dest.x, this.player2.alpha);
    //     this.player2.pos.y = lerp(this.player2.lastPos.y, this.player2.dest.y, this.player2.alpha);
    //     this.player2.alpha += this.lagAlpha;
    //     if(this.player2.alpha > 1){
    //         this.player2.alpha = 1;
    //     }
    //     this.boundPlayer(this.player2);

    //     //ball
    //     if(!app.main.host){
    //         if(this.ball.pos.x === this.ball.lastPos.x &&
    //             this.ball.pos.y === this.ball.pos.y) return;
    //         this.ball.pos.x = lerp(this.ball.lastPos.x, this.ball.dest.x, this.ball.alpha);
    //         this.ball.pos.y = lerp(this.ball.lastPos.y, this.ball.dest.y, this.ball.alpha);
    //         this.ball.alpha += this.lagAlpha;
    //         if(this.ball.alpha > 1){
    //             this.ball.alpha = 1;
    //         }            
    //     }
    // },
};