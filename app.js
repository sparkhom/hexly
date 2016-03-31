"use strict";

var canvas = document.getElementById("game");
var globalWidth = window.innerWidth;
var globalHeight = window.innerHeight;
var ratio = 1;
var ctx = canvas.getContext("2d");

var hexSize = new Point(50,50);
var hexHeight = hexSize.y * 2;
var hexWidth = Math.sqrt(3) / 2 * hexHeight;
var vertDistance = hexHeight * 3/4;
var horizDistance = hexWidth;
var showCoordsText = false;

var mapstore = [['W','W','W','W','W'],
                ['W','W','W','W','W'],
                ['W','W','L','L','W'],
                ['W','W','L','L','W'],
                ['W','W','L','L','L'],
                ['W','W','L','L','L']];
var initmap = new Map(mapstore);

var worldHeight = initmap.height * vertDistance;
var worldWidth = initmap.width * horizDistance;
var oldPos = new Point(0,0);
var mouseStart = new Point(0,0);

var layout = new Layout(layout_pointy, hexSize, new Point(hexSize.x, hexSize.y));

setup();

function setup() {
    if (ctx) {
        init();
        requestAnimationFrame(update);
        canvas.onmouseover = showMouseOver;
        canvas.onmouseout = showMouseOut;
        canvas.onmousedown = mouseDown;
        canvas.onmouseup = mouseUp;
        window.onresize = resize;
        resize();
    }
}

function init() {
    draw();
}

function update() {
    requestAnimationFrame(update);
    if (ratio != (window.devicePixelRatio || 1))
        resize();
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var r = 0; r < initmap.height; r++) {
        var r_offset = Math.floor(r/2);
        for (var q = -r_offset; q < initmap.width - r_offset; q++) {
            var type = initmap.get(q, r);
            var hex = new Hex(q, r, -q-r);
            var center = hex_to_pixel(layout, hex);
            ctx.beginPath();
            for (var i = 0; i < 6; i++) {
                var pt = hex_corner_offset(layout, i);
                if (i == 0) {
                    ctx.moveTo(center.x + pt.x, center.y + pt.y);
                } else {
                    ctx.lineTo(center.x + pt.x, center.y + pt.y);
                }
            }
            ctx.closePath();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 4;
            ctx.stroke();

            if (type == 'W')
                ctx.fillStyle = '#8ED6FF';
            else if (type == '0')
                ctx.fillStyle = '#000';
            else
                ctx.fillStyle = '#8EFFD6';

            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = '#ff8E8E';
            ctx.arc(center.x, center.y, 5, 0, 2*Math.PI);
            ctx.closePath();
            ctx.fill();

            if (showCoordsText) {
                ctx.fillStyle = '#ffffff';
                ctx.font = '1.1em Arial';
                var coordsText = q + "," + r;
                var metrics = ctx.measureText(coordsText);
                ctx.fillText(coordsText, center.x - (metrics.width/2), center.y);
            }
        }
    }
}

function showMouseOver() {
    showCoordsText = true;
}

function showMouseOut() {
    showCoordsText = false;
    canvas.onmousemove = null;
}

function mouseDown(e) {
    canvas.onmousemove = mouseMove;
    mouseStart.x = e.clientX;
    mouseStart.y = e.clientY;
    oldPos.x = layout.origin.x;
    oldPos.y = layout.origin.y;
}

function mouseUp(e) {
    canvas.onmousemove = null;
    if (oldPos.x == layout.origin.x && oldPos.y == layout.origin.y) {
        var h = hex_round(pixel_to_hex(layout, new Point(e.clientX, e.clientY)));
        initmap.set(h.q, h.r, '0');
    }
}

function mouseMove(e) {
    var newPosX = oldPos.x - (mouseStart.x - e.clientX);
    var newPosY = oldPos.y - (mouseStart.y - e.clientY);
    var newPos = new Point(newPosX, newPosY);

    if (withinXBounds(newPos.x))
        layout.origin.x = newPos.x;
    if (withinYBounds(newPos.y))
        layout.origin.y = newPos.y;
}

function resize() {
    ratio = window.devicePixelRatio || 1;
    globalHeight = window.innerHeight*ratio;
    globalWidth = window.innerWidth*ratio;
    canvas.width = globalWidth;
    canvas.height = globalHeight;
    canvas.style.width = Math.floor(globalWidth / ratio);
    canvas.style.height = Math.floor(globalHeight / ratio);
    ctx.scale(ratio, ratio);

    if (!withinXBounds(layout.origin.x))
        layout.origin.x = hexSize.x;
        oldPos.x = hexSize.x;
    if (!withinYBounds(layout.origin.y))
        layout.origin.y = hexSize.y;
        oldPos.y = hexSize.y;
    draw();
}

function withinBounds(pos) {
    return withinXBounds(pos.x) && withinYBounds(pos.y);
}

function withinXBounds(posX) {
    if (posX < (canvas.width / ratio) - (worldWidth / 2) && posX > -(worldWidth / 2))
        layout.origin.x = posX;
}

function withinYBounds(posY) {
    if (posY < (canvas.height / ratio) - (worldHeight / 2) && posY > -(worldHeight / 2))
        layout.origin.y = posY;
}
