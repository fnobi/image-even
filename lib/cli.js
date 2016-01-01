(function () {
    var optimist = require('optimist');
    var colors = require('colors');
    
    var ImageEven = require(__dirname + '/ImageEven');

    var argv = optimist
            .boolean('h')
            .alias('h', 'help')
            .default('h', false)
            .describe('h', 'show this help.')

            .argv;

    if (argv.h) {
        optimist.showHelp();
        return;
    }

    var imageEven = new ImageEven({
        files: argv._
    });

    imageEven.on('pass', function (e) {
        console.error([
            '[pass]',
            (e.width && e.height) ? (e.width + 'x' + e.height) : '(error)',
            e.file
        ].join('\t'));
    });
    
    imageEven.on('resize', function (e) {
        console.log([
            '[resize]'.green,
            e.width + 'x' + e.height,
            e.file
        ].join('\t'));
    });

    imageEven.on('end', function (err) {
        if (err) {
            console.log('[error]'.red, err);
        } else {
            // console.log('[done]'.green);
        }
    });
    
    imageEven.start();
})();
