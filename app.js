"use strict";

var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var globalWidth = window.innerWidth;
var globalHeight = window.innerHeight;
var ratio = 1;
var debug = true;
var timeToDraw = 0;

var keyCodes = {};

var hexSize = new Point(30,30);
var hexHeight = hexSize.y * 2;
var hexWidth = Math.sqrt(3) / 2 * hexHeight;
var vertDistance = hexHeight * 3/4;
var horizDistance = hexWidth;
var showCoordsText = false;

var currentCell = false;
var selectedCell = false;
var needsUpdate = false;

var mapstore = [];
generateRandomMap();
var initmap = new Map(mapstore);

var worldHeight = initmap.height * vertDistance;
var worldWidth = initmap.width * horizDistance;
var oldPos = new Point(0,0);
var mouseStart = new Point(0,0);
var mouseDrag = false;

var layout = new Layout(layout_pointy, hexSize, new Point(hexSize.x, hexSize.y));

setup();

function setup() {
    if (ctx) {
        needsUpdate = true;
        init();
        requestAnimationFrame(update);
        canvas.onmouseover = mouseOver;
        canvas.onmouseout = mouseOut;
        canvas.onmousemove = mouseMove;
        canvas.onmousedown = mouseDown;
        canvas.onmouseup = mouseUp;
        window.onkeydown = keyDown;
        window.onkeyup = keyUp;
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
    if (!needsUpdate)
        return;
    var startDraw = Date.now();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var r = 0; r < initmap.height; r++) {
        var r_offset = Math.floor(r/2);
        for (var q = -r_offset; q < initmap.width - r_offset; q++) {
            var hex = initmap.get(q, r);
            var cell = hex;
            var center = hex_to_pixel(layout, hex);
            if (center.x < -hexSize.x || center.x > globalWidth + hexSize.x)
                continue;
            if (center.y < -hexSize.y || center.y > globalHeight + hexSize.y)
                continue;
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

            ctx.fillStyle = cell.getColor();
            ctx.fill();

            if (cell.moveEnabled) {
                drawCenterCircle(center);
            }

            if (showCoordsText) {
                ctx.font = '1.0em Arial';
                ctx.fillStyle = '#888';
                var coordsText = q + "," + r;
                var metrics = ctx.measureText(coordsText);
                ctx.fillText(coordsText, center.x - (metrics.width/2), center.y);
            }

        }
    }
    if (debug) {
        var rightText = '';
        timeToDraw = (timeToDraw * 0.9999) + ((Date.now() - startDraw) * 0.0001);
        var fpsCount = Math.floor(1000 / timeToDraw);
        rightText += 'Current FPS: ' + fpsCount;

        var leftText = 'Hexly (dev) | ';
        if (currentCell)
            leftText += 'current cell at (' + currentCell.q + ',' + currentCell.r + '): ' + currentCell.toString() + ' ';
        if (showCoordsText)
            leftText += 'show-coords ';
        drawStatusBar(leftText, rightText);
    }
    needsUpdate = false;
}

function generateRandomMap() {
    for (var i = 0; i < 15; i++) {
        mapstore[i] = [];
        for (var j = 0; j < 30; j++) {
            var coord = new OffsetCoord(j, i);
            var h = roffset_to_cube(ODD, coord);
            var random = Math.floor((Math.random() * 10) + 1);
            var cell = new MapCell(h.q, h.r, h.s, MapCell.Types.NONE);
            if (random > 6) {
                mapstore[i][j] = cell;
                continue;
            }
            if (random > 6)
                cell.type = MapCell.Types.WATER;
            else
                random = Math.floor((Math.random() * 10) + 1);
                if (random > 1)
                    cell.type = MapCell.Types.LAND;
                else
                    cell.type = MapCell.Types.MAGIC;

            mapstore[i][j] = cell;
        }
    }
}

function drawCenterCircle(center) {
    ctx.beginPath();
    ctx.fillStyle = '#ff8E8E';
    ctx.arc(center.x, center.y, 5, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
}

function drawStatusBar(leftText, rightText) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#eee';
    ctx.fillRect(0, globalHeight - 20, globalWidth, globalHeight);
    ctx.font = '0.5em Arial';
    ctx.strokeText(leftText, 10, globalHeight - 7);
    var metrics = ctx.measureText(rightText);
    ctx.strokeText(rightText, globalWidth - metrics.width - 10, globalHeight - 7);
}

function mouseOver() {
}

function mouseOut() {
    mouseDrag = false;
}

function mouseDown(e) {
    mouseStart.x = e.clientX;
    mouseStart.y = e.clientY;
    oldPos.x = layout.origin.x;
    oldPos.y = layout.origin.y;
    mouseDrag = true;
    needsUpdate = true;
}

function mouseUp(e) {
    mouseDrag = false;
    if (oldPos.x == layout.origin.x && oldPos.y == layout.origin.y && currentCell) {
        if (selectedCell) {
            for (var i = 0; i < hex_directions.length; i++) {
                var neighbor = hex_neighbor(selectedCell, i);
                var neighborcell = initmap.get(neighbor.q, neighbor.r);
                if (neighborcell && neighborcell.type != MapCell.Types.NONE) {
                    neighborcell.moveEnabled = false;
                }
            }
        }
        if (currentCell == selectedCell) {
            selectedCell = false;
        } else {
            selectedCell = currentCell;
            for (var i = 0; i < hex_directions.length; i++) {
                var neighbor = hex_neighbor(selectedCell, i);
                var neighborcell = initmap.get(neighbor.q, neighbor.r);
                if (neighborcell && neighborcell.type != MapCell.Types.NONE) {
                    neighborcell.moveEnabled = true;
                }
            }
        }
    }
    needsUpdate = true;
}

function mouseMove(e) {
    if (mouseDrag) {
        var newPosX = oldPos.x - (mouseStart.x - e.clientX);
        var newPosY = oldPos.y - (mouseStart.y - e.clientY);
        var newPos = new Point(newPosX, newPosY);

        if (withinXBounds(newPos.x))
            layout.origin.x = newPos.x;
        if (withinYBounds(newPos.y))
            layout.origin.y = newPos.y;
    }

    var h = hex_round(pixel_to_hex(layout, new Point(e.clientX, e.clientY)));
    currentCell = initmap.get(h.q, h.r);
    needsUpdate = true;
}

function keyUp(e) {
    keyCodes[e.keyCode] = false;
    needsUpdate = true;
}

function keyDown(e) {
    if (e.keyCode == 67)
        showCoordsText = !showCoordsText;
    if (e.keyCode == 68)
        debug = !debug;
    keyCodes[e.keyCode] = true;
    needsUpdate = true;
}

function resize() {
    ratio = window.devicePixelRatio || 1;
    globalHeight = window.innerHeight;
    globalWidth = window.innerWidth;
    canvas.width = globalWidth*ratio;
    canvas.height = globalHeight*ratio;
    canvas.style.width = globalWidth;
    canvas.style.height = globalHeight;
    ctx.scale(ratio, ratio);

    if (!withinXBounds(layout.origin.x))
        layout.origin.x = hexSize.x;
        oldPos.x = hexSize.x;
    if (!withinYBounds(layout.origin.y))
        layout.origin.y = hexSize.y;
        oldPos.y = hexSize.y;
    needsUpdate = true;
    draw();
}

function withinBounds(pos) {
    return withinXBounds(pos.x) && withinYBounds(pos.y);
}

function withinXBounds(posX) {
    if (posX < globalWidth - (worldWidth / 2) && posX > -(worldWidth / 2))
        layout.origin.x = posX;
}

function withinYBounds(posY) {
    if (posY < globalHeight - (worldHeight / 2) && posY > -(worldHeight / 2))
        layout.origin.y = posY;
}
