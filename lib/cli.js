(function () {
    var optimist = require('optimist');
    var HinagataNodebin = require(__dirname + '/hinagata-nodebin');

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

    new HinagataNodebin();
})();
