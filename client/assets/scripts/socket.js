"use strict";

let socket;

//initial connection to server
function init(){
    socket = io.connect();

    // //on joining the server, start up game
    socket.on('join', (data) => {
        app.main.init(data.player, data.players, data.ball);
    });
    //called when the server send out information about all clients
    socket.on(`updateClient`, (data) => {
        if(app.player.player === undefined) return;
        app.player.updatePlayersInformation(data.player[app.player.player.room]);
        app.ball.updateBallInformation(data.ball[app.player.player.room]);
    });
    //called when someone changes a room so all clients remain in sync
    socket.on('roomChange', (data) => {
        if(data.id == app.player.player.id){
            app.player.player.pos = {
                x: (app.main.WIDTH) - app.player.player.pos.x,
                y: (app.main.HEIGHT) - app.player.player.pos.y,
            }
            app.ball.prevPos = app.ball.dest;
            app.player.player.room = data.newRoom;
        }
    });
    //called when a client makes a goal so all clients are in sync
    socket.on('goal', (data) => {
        if(app.player.player.room != data.room) return;
        var canvas = document.getElementById('canvas');
        canvas.classList.add('animate');
        setTimeout(() => {
            canvas.classList.remove('animate');
        }, 1000);
        app.main.doBits(data.pos);
    })

    //gets mouse move events (ended up not using this anywhere in the project)
    window.addEventListener('mousemove', function(e) { 
        var canvas = document.getElementById('canvas')
        app.main.mouse = getMousePos(canvas, e); 
    });
}
//update the server on this specific client
function updatePlayer(player){
    socket.emit('updatePlayer', {player})
}

window.onload = init;