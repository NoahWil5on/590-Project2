"use strict";

let socket;

//initial connection to server
function init(){
    socket = io.connect();

    // //on joining the server, start up game
    socket.on('join', (data) => {
        app.main.init(data.player, data.players);
    });
    socket.on('updatePlayers', (players) => {
        app.game.players = players;
        app.game.player.vel.y = players[app.game.player.id].vel.y;
    })
}
function updatePlayer(){
    socket.emit('update', app.game.player);
}
function updateJump(){
    socket.emit('jump', {});
}
window.onload = init;