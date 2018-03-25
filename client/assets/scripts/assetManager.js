const getProps = () => {
    var door = document.getElementById('door');
    var border = document.getElementById('border');
    var ball = document.getElementById('soccerball');

    return {
        door,
        border,
        ball
    }
}

const getHair = (num) => {
    num++;
    var hair = document.getElementById(`hair_0${num}`);
    if(hair) return hair;

    return document.getElementById(`hair_01`);
}
const getShoe = (num) => {
    num++;
    var shoe = document.getElementById(`shoe_0${num}`);
    if(shoe) return shoe;

    return document.getElementById(`shoe_01`);
}
const getHead = (num) => {
    num++;
    var head = document.getElementById(`head_0${num}`);
    if(head) return head;

    return document.getElementById(`head_01`);
}
const getShirt = (num) => {
    num++;
    var shirt = document.getElementById(`shirt_0${num}`);
    if(shirt) return shirt;

    return document.getElementById(`shirt_01`);
}
const getEyes = () => {
    return document.getElementById(`eyes`)
}