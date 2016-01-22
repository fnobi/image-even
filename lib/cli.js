var optimist = require('optimist');
var colors = require('colors');

var ImageEven = require(__dirname + '/ImageEven');

(function () {
    var argv = optimist
            .boolean('h')
            .alias('h', 'help')
            .default('h', false)
            .describe('h', 'show this help.')

            .string('u')
            .alias('u', 'unit')
            .default('u', '2')
            .describe('u', 'resize unit.')

            .string('x')
            .alias('x', 'unit-x')
            .describe('x', 'resize unit (x).')

            .string('y')
            .alias('y', 'unit-y')
            .describe('y', 'resize unit (y).')

            .string('g')
            .alias('g', 'grav')
            .describe('g', 'gravity (0~1)')

            .argv;

    if (argv.h) {
        optimist.showHelp();
        return;
    }

    var imageEven = new ImageEven({
        files: argv._,
        unit: parseInt(argv.unit),
        unitX: parseInt(argv.x),
        unitY: parseInt(argv.y),
        grav: parseFloat(argv.g)
    });

    imageEven.on('pass', (e) => {
        console.error([
            '[pass]  ',
            (e.width && e.height) ? (e.width + 'x' + e.height) : '(error)',
            e.file
        ].join('\t'));
    });
    
    imageEven.on('resize', (e) => {
        console.log([
            '[resize]'.green,
            e.width + 'x' + e.height,
            e.file
        ].join('\t'));
    });

    imageEven.on('end', (err) => {
        if (err) {
            console.log('[error]'.red, err);
        } else {
            // console.log('[done]'.green);
        }
    });
    
    imageEven.start();
})();
