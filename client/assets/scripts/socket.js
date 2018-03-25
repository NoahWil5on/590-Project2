"use strict";

let socket;

//initial connection to server
function init(){
    socket = io.connect();

    // //on joining the server, start up game
    socket.on('join', (data) => {
        app.main.init(data.player,data.players);
    });
    socket.on('updatePlayers', (data) => {
        app.player.players = data;
    })

    window.addEventListener('mousemove', function(e) { 
        var canvas = document.getElementById('canvas')
        app.main.mouse = getMousePos(canvas, e); 
    });
}
function updatePlayer(player){
    socket.emit('updatePlayer', {player})
}

window.onload = init;