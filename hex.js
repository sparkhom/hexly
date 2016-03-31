"use strict";

function Point(x, y) {
    return {x: x, y: y};
}

function Hex(q, r, s) {
    return {q: q, r: r, s: s};
}

function hex_corner(center, size, i) {
    var angle_deg = 60 * i + 30;
    var angle_rad = Math.PI / 180 * angle_deg;
    return Point(center.x + size * Math.cos(angle_rad),
                 center.y + size * Math.sin(angle_rad));
}
