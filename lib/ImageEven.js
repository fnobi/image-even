"use strict";

var EventEmitter = require('events').EventEmitter;

var gm = require('gm');
var async = require('async');

class ImageEven extends EventEmitter {
    constructor(opts) {
        super();
        opts = opts || {};

        this.files = opts.files;
        this.unit = opts.unit || 2;
        
        if (!this.files) {
            throw new Error('no files.');
        }
    }

    start() {
        async.forEach(this.files, (file, next) => {
            gm(file)
                .identify((err, data) => {
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
                });
        }, (err) => {
            this.emit('end', err);
        });
    }

    resize(file, data, callback) {
        var unit = this.unit;

        var width = data.size.width;
        var height = data.size.height;

        if ((width % unit) || (height % unit)) {
            var x = unit - (width % unit);
            var y = unit - (height % unit);
            gm(file)
                .borderColor('transparent')
                .border(x, y)
                .crop(width + x, height + y, x, y)
                .write(file, (err) => {
                    this.emit('resize', {
                        file: file,
                        width: width + x,
                        height: height + y
                    });
                    callback(err);
                });
        } else {
            this.emit('pass', {
                file: file,
                width: width,
                height: height
            });
            callback();
        }
    }
}

module.exports = ImageEven;
