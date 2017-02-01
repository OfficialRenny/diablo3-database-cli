var DBWorker = require('../db_worker');

var DATABASES = ['item', 'skill'];

var cmd = {
  command: 'create',
  desc:    '',
  builder: {
    outdir: {
      type:     'string',
      alias:    'o',
      default:  '.',
      describe: 'Directory to save the databases.',
    },
    concurrency: {
      type:     'number',
      alias:    'c',
      default:  5,
      describe: 'How many worker threads used.',
    },
    databases: {
      type:     'array',
      alias:    'd',
      choices:  DATABASES,
      describe: 'Types of databases to be created.',
    },
    all: {
      type:     'boolean',
      alias:    'a',
      default:  false,
      describe: 'Create all types of databases.',
    },
  },
};

function onCreated(name) {
  console.log('Created', name);
}

cmd.handler = function(argv) {
  if (argv.all)
    argv.databases = DATABASES;

  argv.databases.forEach(function(database) {
    var worker = new DBWorker(database, argv.outdir, argv.concurrency);
    worker.run(onCreated);
  });
};

module.exports = cmd;
