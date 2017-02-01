var fs = require('fs');

var _ = require('underscore');
var sprintf = require('sprintf-js').sprintf;

var h = require('../helper');

var cmd = {
  command: 'stat <filename>',
  desc:    '',
  builder: {
  },
};

function line(name, value) {
  console.log(sprintf('%-20s %15s', name || '', value || ''));
}

cmd.handler = function(argv) {
  var run = _.partial(h.jq, _, argv.filename);
  var stat = fs.statSync(argv.filename);

  line('[file]');
  line('Name', argv.filename);
  line('Size', stat.size);
  line();

  line('[' + run('.[0]')._type + ']');
  line('All', run('.[1:]|length'));
  run('.[1:] | ' +
      'group_by(.owner) | ' +
      'map({' +
      '  owner: .[0].owner,' +
      '  count: .|length' +
      '})').forEach(function(x) {
    line(x.owner, x.count);
  });
  line();

  line('[sanity]');
  line('Active w/o runes',
       '' + run('map(select((.active == true) and (.runes | any? | not))) | length'));
  line('Passive w/ runes',
       '' + run('map(select((.active == false) and (.runes | any?))) | length'));
  line('Not 5 runes',
       '' + run('map(select((.active == true) and (.runes | length) != 5)) | length'));
};

module.exports = cmd;
