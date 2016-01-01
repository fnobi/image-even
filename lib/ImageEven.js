var util = require('util');

var gm = require('gm');
var async = require('async');

var ImageEven = function (opts) {
    opts = opts || {};

    this.files = opts.files;
    this.unit = opts.unit || 2;

    if (!this.files) {
        throw new Error('no files.');
    }
};

util.inherits(ImageEven, require('events').EventEmitter);

ImageEven.prototype.start = function () {
    async.forEach(this.files, function (file, next) {
        gm(file)
            .identify(function (err, data) {
                if (err) {
                    // 画像じゃないものが入ってくるのも許容
                    this.emit('pass', {
                        file: file,
                        error: err
                    });
                    next();
                } else {
                    this.emit('match', file);
                    this.resize(file, data, next);
                }
            }.bind(this));
    }.bind(this), function (err) {
        this.emit('end', err);
    }.bind(this));
};

ImageEven.prototype.resize = function (file, data, callback) {
    var unit = this.unit;

    var width = data.size.width;
    var height = data.size.height;

    if ((width % unit) || (height % unit)) {
        var x = (width % unit);
        var y = (height % unit);
        gm(file)
            .borderColor('transparent')
            .border(x, y)
            .crop(width + x, height + y, x, y)
            .write(file, function (err) {
                this.emit('resize', {
                    file: file,
                    width: width + x,
                    height: height + y
                });
                callback(err);
            }.bind(this));
    } else {
        this.emit('pass', {
            file: file,
            width: width,
            height: height
        });
        callback();
    }
};

module.exports = ImageEven;
