(function () {
    var optimist = require('optimist');
    var HinagataNodebin = require(__dirname + '/HinagataNodebin');

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

    var hinagataNodebin = new HinagataNodebin();
})();
