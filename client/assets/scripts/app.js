"use strict";

var app = app || {};

app.main = {

    canvas: undefined,
    ctx: undefined,
    WIDTH: 800,
    HEIGHT: 450,
    
    dt: 0,
    lastUpdate: undefined,
    myUpdate: undefined,

    init: function(id, players){
        this.canvas = document.getElementById('canvas');
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.ctx = this.canvas.getContext('2d');

        app.game.init(id,players);

        this.myUpdate = this.update.bind(this);
        this.myUpdate();
    },

    update: function(delta){
        if(this.lastUpdate === undefined) this.lastUpdate = delta;
        this.animationID = requestAnimationFrame(this.myUpdate);
        this.dt = (delta - this.lastUpdate) / 1000;

        this.clear();
        app.game.update(this.dt,this.ctx);

        this.lastUpdate = delta;
    },
    clear: function(){
        this.ctx.save();

        this.ctx.fillStyle = "#466622";
        this.ctx.clearRect(0,0,this.WIDTH,this.HEIGHT);
        this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);

        this.ctx.restore();
    }
}