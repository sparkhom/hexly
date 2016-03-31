"use strict";

function Map(store) {
    this.store = store;
    this.height = store.length;
    this.width = store[0].length;
}

Map.prototype.get = function(q, r) {
    return this.store[r][Math.floor(q + r/2)];
}

Map.prototype.set = function(q, r, val) {
    this.store[r][Math.floor(q + r/2)] = val;
}
