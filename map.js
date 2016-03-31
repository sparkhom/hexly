"use strict";

function Map(store) {
    this.store = store;
    this.height = store.length;
    this.width = store[0].length;
};

Map.prototype.qrij = function(q, r) {
    var i = r;
    var j = Math.floor(q + r/2);
    if (i < 0 || j < 0)
        return false;
    if (i >= this.height || j >= this.width)
        return false;
    return [i, j];
};

Map.prototype.get = function(q, r) {
    var ij = this.qrij(q, r);
    if (!ij)
        return false;
    var i = ij[0];
    var j = ij[1];
    return this.store[i][j];
};

Map.prototype.set = function(q, r, val) {
    var ij = this.qrij(q, r);
    if (!ij)
        return false;
    var i = ij[0];
    var j = ij[1];
    this.store[i][j] = val;
};

function MapCell(q, r, s, type) {
    this.q = q;
    this.r = r;
    this.s = s;
    this.type = type;
    this.height = 0;
    this.moveEnabled = false;
};

MapCell.prototype.toString = function() {
    return '[MapCell ' + this.getTypeText() + ', ' + this.height + ']';
};

MapCell.Types = {
    WATER : 0,
    LAND : 1,
    WALL : 2,
    MAGIC : 3,
    NONE : 4
};

MapCell.prototype.getColor = function() {
    switch (this.type) {
        case MapCell.Types.WATER:
            return '#8ED6FF';
        case MapCell.Types.MAGIC:
            return '#FFD6FF';
        case MapCell.Types.LAND:
            return '#8EFFD6';
        case MapCell.Types.WALL:
            return '#000000';
        case MapCell.Types.NONE:
            return '#fff';
    }
};

MapCell.prototype.getTypeText = function() {
    switch (this.type) {
        case MapCell.Types.WATER:
            return 'Water';
        case MapCell.Types.MAGIC:
            return 'Magic';
        case MapCell.Types.LAND:
            return 'Land';
        case MapCell.Types.WALL:
            return 'Wall';
        case MapCell.Types.NONE:
            return 'None';
    }

};
