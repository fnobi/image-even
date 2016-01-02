var util = require('util');

var HinagataNodebin = function (opts) {
    opts = opts || {};
    
};

util.inherits(HinagataNodebin, require('events').EventEmitter);

HinagataNodebin.prototype.start = function () {
    this.emit('end');
};

module.exports = HinagataNodebin;
