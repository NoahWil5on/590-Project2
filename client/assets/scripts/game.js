"use strict";

var app = app || {};

app.game = {
    player: undefined,
    players: undefined,

    speed: 30,
    maxSpeed: 300,
    reset: true,
    patrick: undefined,
    monster: undefined,
    skip: true,

    init: function(id, players){
        this.players = players;
        
        this.player = players[id];
        this.player.width = 60;
        this.player.height = 81;
        console.log(this.player);

        this.patrick = document.getElementById('patrick');
        this.monster = document.getElementById('monster');
    },
    update: function(dt, ctx){
        if(this.skip){            
            this.skip = false;
            return;
        }
        if(this.player.pos.y > app.main.HEIGHT - this.player.height){
            this.player.pos.y = app.main.HEIGHT - this.player.height;
            this.player.vel.y = 0;
            this.reset = true;
        }
        updatePlayer();
        this.draw(ctx);
        this.updateMove(dt);
        this.updatePlayers(dt);
        this.boundPlayer();

    },
    boundPlayer: function(){
        if(this.player.pos.x < 0){
            this.player.pos.x = 0;
            this.player.vel.x = 0;
        }else if(this.player.pos.x > app.main.WIDTH - this.player.width){
            this.player.pos.x = app.main.WIDTH - this.player.width;
            this.player.vel.x = 0;
        }
    },
    updateMove: function(dt){
        var move = false;
        if(Key.isDown(Key.LEFT) || Key.isDown(Key.A)){
            this.player.vel.x -= this.speed;
            move = true;
        }
        if(Key.isDown(Key.RIGHT) || Key.isDown(Key.D)){
            this.player.vel.x += this.speed;
            move = true;
        }
        if((Key.isDown(Key.SPACE) || Key.isDown(Key.W) || Key.isDown(Key.UP)) && this.reset) {
            console.log(this.player.vel.y);
            this.player.vel.y = -400;
            updateJump();
            this.reset = false;
        }

        if(!move) this.player.vel.x *= .9;
        if(this.player.vel.x > this.maxSpeed) this.player.vel.x = this.maxSpeed;
        if(this.player.vel.x < -this.maxSpeed) this.player.vel.x = -this.maxSpeed;

        this.player.pos.x += this.player.vel.x * dt;
        this.player.pos.y += this.player.vel.y * dt;
    },
    updatePlayers: function(dt){
        Object.keys(this.players).forEach(id => {
            if(id === this.player.id) return;
            if(this.players[id] === undefined) return;

            var player = this.players[id];

            if(player.pos.x < 0){
                player.pos.x = 0;
            }else if(player.pos.x > app.main.WIDTH - this.player.width){
                player.pos.x = app.main.WIDTH - this.player.width;
            }
    
            if(player.pos.y > app.main.HEIGHT - this.player.height){
                player.pos.y = app.main.HEIGHT - this.player.height;
            }
        });
    },
    draw: function(ctx){
        this.drawPlayers(ctx);        
    },
    drawPlayers: function(ctx){
        ctx.save();

        Object.keys(this.players).forEach(id => {
            if(this.players[id] === undefined) return;
            var player = this.players[id]

            if(player.id === this.player.id){
                ctx.drawImage(
                    this.patrick,
                    this.player.pos.x,
                    this.player.pos.y,
                    this.player.width,
                    this.player.height
                );
            }else{
                ctx.drawImage(
                    this.monster,
                    player.pos.x,
                    player.pos.y,
                    this.player.width,
                    this.player.height
                );
            }
        });        

        ctx.restore();
    },
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