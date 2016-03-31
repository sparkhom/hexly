"use strict";

function Map(store) {
    this.store = store;
}

Map.prototype.get = function(q, r) {
    return this.store[q][Math.floor(q + r/2)];
}

Map.prototype.set = function(q, r, val) {
    this.store[q][Math.floor(q + r/2)] = val;
}
