const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const through = require('through2');
const Vinyl = require('vinyl');
const gutil = require('gulp-util');

const ImageEven = require('./ImageEven');

module.exports = function (opts) {
    opts = opts || {};

    const fileMap = {};

    function transform (file, encoding, callback) {
        fileMap[file.path] = file;
        callback();
    }

    function flush (callback) {
        opts.files = _.keys(fileMap);
        const imageEven = new ImageEven(opts);

        imageEven.on('pass', (e) => {
            this.push(fileMap[e.file]);
        });
        
        imageEven.on('resize', (e) => {
            const base = fileMap[e.file].base;
            
            gutil.log(
                path.relative(base, e.file),
                '=>',
                (e.width && e.height) ? [ e.width, e.height ].join('x') : '(error)'
            );
            
            this.push(new Vinyl({
                path: e.file,
                base: base,
                contents: fs.createReadStream(e.file)
            }));
        });

        imageEven.on('end', () => {
            callback();
        });
        
        imageEven.start();
    }

    function log () {

    }

    return through.obj(transform, flush);
};
