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
        this.unitX = opts.unitX || this.unit;
        this.unitY = opts.unitY || this.unit;
        this.grav = opts.grav || 1;
        
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
                        this.emit('identify', {
                            width: data.size.width,
                            height: data.size.height,
                            unitX: this.unitX,
                            unitY: this.unitY
                        });
                        this.resize(file, data, next);
                    }
                });
        }, (err) => {
            this.emit('end', err);
        });
    }

    resize(file, data, callback) {
        var unitX = this.unitX;
        var unitY = this.unitY;
        var grav = this.grav;

        var width = data.size.width;
        var height = data.size.height;

        if ((width % unitX) || (height % unitY)) {
            var x = (width % unitX) ? (unitX - (width % unitX)) : 0;
            var y = (height % unitY) ? (unitY - (height % unitY)) : 0;
            gm(file)
                .borderColor('transparent')
                .border(x, y)
                .crop(width + x, height + y, Math.floor(x * grav), Math.floor(y * grav))
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
