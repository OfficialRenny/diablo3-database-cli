var cli = {};

cli.run = function() {
  require('yargs')
    .commandDir('commands')
    .completion()
    .help()
    .strict()
    .argv;
};

module.exports = cli;
