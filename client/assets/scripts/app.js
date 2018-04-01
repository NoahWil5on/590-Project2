"use strict";

var app = app || {};

//main app controller
app.main = {

    canvas: undefined,
    ctx: undefined,
    WIDTH: 1200,
    HEIGHT: 675,
    
    dt: 0,
    lastUpdate: undefined,
    myUpdate: undefined,
    roomNum: 0,
    mouse: undefined,

    //set up document and other game componenets
    init: function(id, players, ball){
        this.canvas = document.getElementById('canvas');
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.ctx = this.canvas.getContext('2d');

        app.player.init(id, players);
        app.ball.init(ball);

        this.myUpdate = this.update.bind(this);
        this.myUpdate();
    },

    //update called 60 times a second
    update: function(delta){
        if(this.lastUpdate === undefined) this.lastUpdate = delta;
        this.animationID = requestAnimationFrame(this.myUpdate);
        this.dt = (delta - this.lastUpdate) / 1000;

        //updates major components
        this.clear();
        app.player.update(this.dt,this.ctx);
        app.ball.update(this.dt,this.ctx);
        patricles.update(this.dt);
        this.drawParticles();

        updatePlayer(app.player.player);

        this.lastUpdate = delta;
    },
    //draw a particles system if there is one
    drawParticles: function(){
        for(var i = 0; i < patricles.bits.length; i++){
            var bit = patricles.bits[i];
            this.ctx.fillStyle = `rgba(${bit.color.r},${bit.color.g},${bit.color.b},${bit.color.a})`;
            this.ctx.fillRect(
                bit.pos.x,
                bit.pos.y,
                bit.width,
                bit.height
            );
        }
    },
    //creates the particles system
    doBits: function(pos){
        patricles.init(pos, 20);
    },
    //clears the screen and draws background
    clear: function(){
        this.ctx.save();

        this.ctx.fillStyle = "#466622";
        this.ctx.clearRect(0,0,this.WIDTH,this.HEIGHT);
        
        this.ctx.drawImage(getProps().field,0,0);
        this.ctx.drawImage(getProps().border,0,0);
        this.drawDoors();

        this.ctx.restore();
    },
    //draw the doors in the background
    drawDoors: function(){
        if(app.player.player === undefined) return;
        switch(app.player.player.room){
            case 'room0':
                this.drawDoor('up');
                this.drawDoor('down');
                this.drawDoor('left');
                this.drawDoor('right');
                break;
            case 'room1':
                this.drawDoor('down');
                break;
            case 'room2': 
                this.drawDoor('left');
                break;
            case 'room3':
                this.drawDoor('up');
                break;
            case 'room4':
                this.drawDoor('right');
                break;
            default: 
                break;
        }
    },
    //draw desired dooor
    drawDoor: function(position){
        var door = getProps().door;
        var toRad = Math.PI / 180;
        this.ctx.save();
        switch(position){
            case 'up':
                this.ctx.drawImage(door, this.WIDTH / 2 - door.width / 2, 0);
                break;
            case 'down':
                this.ctx.translate(this.WIDTH / 2 + door.width / 2, this.HEIGHT);
                this.ctx.rotate(180 * toRad);
                this.ctx.drawImage(door, 0, 0);
                break;
            case 'left':
                this.ctx.translate(0, this.HEIGHT / 2 - door.width / 2);
                this.ctx.rotate(-90 * toRad);
                this.ctx.drawImage(door, -door.width, 0);
                break;
            case 'right':
                this.ctx.translate(this.WIDTH, this.HEIGHT / 2 - door.width / 2);
                this.ctx.rotate(90 * toRad);
                this.ctx.drawImage(door, 0, 0);
                break;
            default:
                break;
        }
        this.ctx.restore();
    }
}