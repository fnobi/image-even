(function () {
    var optimist = require('optimist');
    var ImageEven = require(__dirname + '/image-even');

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

    new ImageEven();
})();
