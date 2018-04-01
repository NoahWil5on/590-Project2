"use strict"

//get a specific art asset
const getProps = () => {
    var door = document.getElementById('door');
    var border = document.getElementById('border');
    var ball = document.getElementById('soccerball');
    var field = document.getElementById('field');

    return {
        door,
        border,
        ball,
        field
    }
}
//get desired hair
const getHair = (num) => {
    num++;
    var hair = document.getElementById(`hair_0${num}`);
    if(hair) return hair;

    return document.getElementById(`hair_01`);
}
//get desired shoe
const getShoe = (num) => {
    num++;
    var shoe = document.getElementById(`shoe_0${num}`);
    if(shoe) return shoe;

    return document.getElementById(`shoe_01`);
}
//get desired head
const getHead = (num) => {
    num++;
    var head = document.getElementById(`head_0${num}`);
    if(head) return head;

    return document.getElementById(`head_01`);
}
//get desired shirt
const getShirt = (num) => {
    num++;
    var shirt = document.getElementById(`shirt_0${num}`);
    if(shirt) return shirt;

    return document.getElementById(`shirt_01`);
}
//get desired blink
const getBlink = (num) => {
    num++;
    var blink = document.getElementById(`blink_0${num}`);
    if(blink) return blink;

    return document.getElementById(`blink_01`);
}
//get eyes
const getEyes = () => {
    return document.getElementById(`eyes`)
}