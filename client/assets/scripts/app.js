"use strict";

var app = app || {};

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

    init: function(id, players){
        this.canvas = document.getElementById('canvas');
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.ctx = this.canvas.getContext('2d');

        app.player.init(id, players);
        app.ball.init();

        this.myUpdate = this.update.bind(this);
        this.myUpdate();
    },

    update: function(delta){
        if(this.lastUpdate === undefined) this.lastUpdate = delta;
        this.animationID = requestAnimationFrame(this.myUpdate);
        this.dt = (delta - this.lastUpdate) / 1000;

        this.clear();
        app.player.update(this.dt,this.ctx);
        app.ball.update(this.dt,this.ctx);

        updatePlayer(app.player.player);

        this.lastUpdate = delta;
    },
    clear: function(){
        this.ctx.save();

        this.ctx.fillStyle = "#466622";
        this.ctx.clearRect(0,0,this.WIDTH,this.HEIGHT);
        this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);

        this.ctx.drawImage(getProps().border,0,0);
        this.drawDoors();

        // this.ctx.fillStyle = "#ff0000";
        // var rect = {
        //     x: 200,
        //     y: 200,
        //     width: 200,
        //     height: 200
        // };
        // if(pointInRect(this.mouse, rect)){
        //      this.ctx.fillStyle = "#0000ff";
        //      this.canvas.style.cursor = "pointer";
        // }else{
        //     this.canvas.style.cursor = "initial";
        // }

        // this.ctx.fillRect(rect.x,rect.y,rect.width,rect.height);

        this.ctx.restore();
    },
    drawDoors: function(){
        switch(this.roomNum){
            case 0:
                this.drawDoor('up');
                this.drawDoor('down');
                this.drawDoor('left');
                this.drawDoor('right');
                break;
            case 1:
                break;
            case 2: 
                break;
            case 3:
                break;
            case 4:
                break;
            default: 
                break;
        }
    },
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