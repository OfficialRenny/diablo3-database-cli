var worker = require('../d3_worker');

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

  worker.outdir = argv.outdir;
  worker.concurrency = argv.concurrency;

  argv.databases.forEach(function(database) {
    switch (database) {
      case 'item':
        worker.getItems(onCreated);
        break;
      case 'skill':
        worker.getSkills(onCreated);
        break;
      default:
        break;
    }
  });
};

module.exports = cmd;
