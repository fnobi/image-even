"use strict";

var util = require('util');
var EventEmitter = require('events').EventEmitter;

class HinagataNodebin extends EventEmitter {
    constructor(opts) {
        super();
        opts = opts || {};
    }

    start() {
        this.emit('end');
    }
}

module.exports = HinagataNodebin;
