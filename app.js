"use strict";

var canvas = document.getElementById("game");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
canvas.tabIndex = 0;
canvas.focus();
var context = canvas.getContext("2d");

canvas.onmouseover = showMouseOver;
canvas.onmouseout = showMouseOut;
canvas.onmousedown = mouseDown;
canvas.onmouseup = mouseUp;
window.onresize = resize;

var hexSize = 50;
var hexHeight = hexSize * 2;
var hexWidth = Math.sqrt(3) / 2 * hexHeight;
var vertDistance = hexHeight * 3/4;
var horizDistance = hexWidth;
var showCoordsText = false;

var map = [[0,0,0,0,0,0,0],
           [0,1,1,1,0,1,0],
           [0,0,1,0,1,0,0],
           [0,1,0,1,0,1,0],
           [0,0,1,0,1,0,0],
           [0,1,0,1,0,1,0]
           ];
var worldHeight = map.length * vertDistance;
var worldWidth = map[0].length * horizDistance;
console.log(worldHeight, worldWidth);
var posX = 0;
var posY = 0;
var oldPosX = 0;
var oldPosY = 0;
var mouseStartX = 0;
var mouseStartY = 0;

draw();

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var k = 0; k < map.length; k++) {
        var add = 0;
        if (k % 2 == 1) {
            add = Math.sqrt(3) * hexSize / 2;
        }
        for (var i = 0; i < map[k].length; i++) {
            context.beginPath();
            //var center = Point(Math.sqrt(3)*i*hexSize + add + hexSize, hexSize*k*2*3/4 + hexSize);
            var center = Point(horizDistance * i + add + hexSize, vertDistance*k + hexSize);
            center.x -= posX;
            center.y -= posY;
            for (var j = 0; j <= 6; j++) {
                var pt = hex_corner(center, hexSize, j);
                if (j == 0) {
                    context.moveTo(pt.x, pt.y);
                } else {
                    context.lineTo(pt.x, pt.y);
                }
            }
            context.closePath();

            context.strokeStyle = '#ffffff';
            context.lineWidth = 4;
            context.stroke();

            if (map[k][i] == 0)
                context.fillStyle = '#8ED6FF';
            else
                context.fillStyle = '#8EFFD6';

            context.fill();

            context.beginPath();
            context.fillStyle = '#ff8E8E';
            context.arc(center.x, center.y, 5, 0, 2*Math.PI);
            context.closePath();
            context.fill();

            if (showCoordsText) {
                context.fillStyle = '#ffffff';
                context.font = '1.1em Arial';
                // x = q, z = r, y = -x-z
                var q = i - (k - (k&1)) / 2;
                var r = k;
                var coordsText = q + "," + r;
                //coordsText = i + "," + k;
                var metrics = context.measureText(coordsText);
                context.fillText(coordsText, center.x - (metrics.width/2), center.y);
            }
        }
    }
}

function showMouseOver() {
    showCoordsText = true;
    draw();
}

function showMouseOut() {
    showCoordsText = false;
    canvas.onmousemove = null;
    draw();
}

function mouseDown(e) {
    canvas.onmousemove = mouseMove;
    mouseStartX = e.clientX;
    mouseStartY = e.clientY;
    oldPosX = posX;
    oldPosY = posY;
}

function mouseUp(e) {
    canvas.onmousemove = null;
}

function mouseMove(e) {
    var newPosX = oldPosX + mouseStartX - e.clientX;
    console.log(newPosX);
    var newPosY = oldPosY + mouseStartY - e.clientY;

    if (newPosX > -canvas.width / 2 && newPosX < (worldWidth / 2))
        posX = newPosX;
    if (newPosY > -canvas.height / 2 && newPosY < (worldHeight / 2))
        posY = newPosY;

    console.log(posX, posY);
    draw();
}

function resize() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    if (posX < - canvas.width / 2 || posX > worldWidth / 2)
        posX = 0;
        oldPosX = 0;
    if (posY < - canvas.height / 2 || posY > worldHeight / 2)
        posY = 0;
        oldPosY = 0;
    draw();
}
