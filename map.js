"use strict";

function Map(store) {
    this.store = store;
    this.height = store.length;
    this.width = store[0].length;
}

Map.prototype.qrij = function(q, r) {
    var i = r;
    var j = Math.floor(q + r/2);
    if (i < 0 || j < 0)
        return false;
    if (i >= this.height || j >= this.width)
        return false;
    return [i, j];
}

Map.prototype.get = function(q, r) {
    var ij = this.qrij(q, r);
    if (!ij)
        return false;
    var i = ij[0];
    var j = ij[1];
    return this.store[i][j];
}

Map.prototype.set = function(q, r, val) {
    var ij = this.qrij(q, r);
    if (!ij)
        return false;
    var i = ij[0];
    var j = ij[1];
    this.store[i][j] = val;
}
