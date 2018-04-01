"use strict";

var app = app || {};

//users character controller/component
app.player = {

    skip: true,
    player: undefined,
    players: undefined,
    playersManager: {},

    maxSpeed: 150,
    blinkTimer: 5,
    myLastUpdate: 0,
    alplhaModifier: 0,
    alpha: .05,

    //initializes player based on response from server
    init: function (player, players) {
        this.myLastUpdate = Date.now();
        this.player = players[player];
        this.updatePlayersInformation(players);

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
        this.player.blink = getRandomInt(this.blinkTimer);
    },
    //updates the player 60fps
    update: function (dt, ctx) {
        if (this.skip) {
            this.skip = false;
            return;
        }
        this.updatePlayers(dt);
        this.updateMovement(dt);
        this.interpolatePositions();
        this.boundPlayer();

        this.player.blink += dt;
        this.draw(ctx);
    },
    //update all other players in game when server responds
    updatePlayersInformation: function(players){
        //lerp timeing info
        var change = (Date.now() - this.myLastUpdate) / 1000;
        this.alplhaModifier = 1 / change;
        this.alpha = .05;

        this.players = players;
        //cycle through all the player
        Object.keys(players).forEach((id) => {
            if (this.player.id === players[id].id || players[id] === undefined) return;

            //updates lerp information
            var player = this.players[id];
            this.players[id].dest = {
                x: player.pos.x + ((player.pos.x - player.lastPos.x) * change * .9),
                y: player.pos.y + ((player.pos.y - player.lastPos.y) * change * .9),
            }
            this.players[id].prevPos = player.pos

            if(this.playersManager[id] === undefined || !this.playersManager[id].pos.x) return
            this.players[id].prevPos = this.playersManager[id].pos;
        });
        this.myLastUpdate = Date.now();
    },
    //update the blinking and walking animation the client sees
    //does not effect other clients
    updatePlayers: function (dt) {
        this.alpha += this.alplhaModifier * dt;
        if(this.alpha > 1) this.alpha = 1;
        Object.keys(this.players).forEach((id) => {
            if (this.player.id === this.players[id].id || this.players[id] === undefined) return;

            var player = this.players[id];

            if (this.playersManager[id] === undefined) {
                this.playersManager[id] = {
                    animationVal: 0,
                    reflect: false,
                    moving: false,
                    blink: getRandomInt(this.blinkTimer)
                };
            }
            this.playersManager[id].blink += dt;
            if (player.pos.x !== player.lastPos.x ||
                player.pos.y !== player.lastPos.y) {
                this.playersManager[id].animationVal += dt * 15;
                this.playersManager[id].moving = true;
            } else {
                this.playersManager[id].animationVal = 0;
                this.playersManager[id].moving = false;
            }
            if (player.prevPos.x < player.pos.x) {
                this.playersManager[id].reflect = true;
            } else if (player.prevPos.x > player.pos.x) {
                this.playersManager[id].reflect = false;
            }

            this.players[id].animationVal = this.playersManager[id].animationVal;
            this.players[id].reflect = this.playersManager[id].reflect;
            this.players[id].moving = this.playersManager[id].moving;
            this.players[id].blink = this.playersManager[id].blink;
        });
    },
    //prevent user from going off screen
    boundPlayer: function () {
        if (this.player.pos.x < 100) {
            this.player.pos.x = 100;
        } else if (this.player.pos.x > app.main.WIDTH - 100) {
            this.player.pos.x = app.main.WIDTH - 100;
        }
        if (this.player.pos.y < 50) {
            this.player.pos.y = 50;
        } else if (this.player.pos.y > app.main.HEIGHT - 140) {
            this.player.pos.y = app.main.HEIGHT - 140;
        }
    },
    //update clients character based on keyboard input
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
    //draw client's player and other players
    draw: function (ctx) {
        Object.keys(this.players).forEach((id) => {
            if (this.player.id === this.players[id].id || this.players[id] === undefined) return;
            this.drawPlayer(ctx, this.players[id]);
        });
        this.drawPlayer(ctx, this.player);
    },
    //draw player function is generic and an be used on any player
    drawPlayer: function (ctx, player) {
        //get all appropriate asthetics
        var shirt = getShirt(player.shirt);
        var head = getHead(player.head);
        var shoe = getShoe(player.shoe);
        var hair = getHair(player.hair);
        var blink = getBlink(player.head);
        var eyes = getEyes();

        ctx.save();

        //stupid stupid bug I don't understand, this fixes it.
        if(!player.pos.x){
            ctx.translate(player.lastPos.x, player.lastPos.y);
        }else{
            ctx.translate(player.pos.x, player.pos.y);
        }


        //draw everything in hardcodes spots relative to user position
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
        if (player.blink % this.blinkTimer < .1) {
            ctx.drawImage(
                blink,
                -blink.width / 2,
                -blink.height / 2 - 68);
        } else {
            ctx.drawImage(
                eyes,
                -eyes.width / 2,
                -eyes.height / 2 - 68);
        }


        if (player.reflect) {
            ctx.scale(-1, 1);
        }
        //draw the number on the player's jersey
        this.drawNumber(ctx, player);


        ctx.restore();
    },
    //draws number and outline of number on jersey
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
    //draws the shoes of any given player based on animation psoition
    drawShoes: function (ctx, player, shoe) {
        ctx.save();

        var offsetX = 0;
        var offsetY_01 = 0;
        var offsetY_02 = 0;

        //use sin and cosine to derive position of individual feet
        if (player.moving) {
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
    },
    //lerp other clients so the user's view is less choppy.
    interpolatePositions: function(){

        Object.keys(this.players).forEach(id => {
            if(this.player.id === this.players[id].id) return;            
            var player = this.players[id];

            this.players[id].pos.x = lerp(player.prevPos.x, player.dest.x, this.alpha);
            this.players[id].pos.y = lerp(player.prevPos.y, player.dest.y, this.alpha);

            this.playersManager[id].pos = {
                x: this.players[id].pos.x,
                y: this.players[id].pos.y  
            }
        })
    },
};