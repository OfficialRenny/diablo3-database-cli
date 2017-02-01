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

function showSkills(jq) {
  line('All', jq('.[1:] | length'));
  jq('.[1:] | ' +
      'group_by(.owner) | ' +
      'map({' +
      '  owner: .[0].owner,' +
      '  num: . | length' +
      '})').forEach(function(x) {
    line(x.owner, x.num);
  });
  line();

  line('[sanity]');
  line('Active w/o runes',
       '' + jq('map(select((.active == true) and (.runes | any? | not))) | length'));
  line('Passive w/ runes',
       '' + jq('map(select((.active == false) and (.runes | any?))) | length'));
  line('Not 5 runes',
       '' + jq('map(select((.active == true) and (.runes | length) != 5)) | length'));
}

function showItems(jq) {
  line('[by quality]');
  line('All', jq('.[1:] | length'));
  ['Normal', 'Magic', 'Rare', 'Legendary', 'Set'].forEach(function(x) {
    line(x, '' + jq('.[1:] | map(select(.quality == "' + x + '")) | length'));
  });
  line('Set Group', jq('.[1:] | sort_by(.set.name) | map(.set.name) | unique | length'));
  line();

  line('[by owner]');
  jq('.[1:] | ' +
      'map(select(.owner != "")) | ' +
      'group_by(.owner) | ' +
      'map({' +
      '  owner: .[0].owner,' +
      '  num: . | length' +
      '})').forEach(function(x) {
    line(x.owner, x.num);
  });
  line();

  line('[sanity]');
}

cmd.handler = function(argv) {
  var stat = fs.statSync(argv.filename);
  line('[file]');
  line('Name', argv.filename);
  line('Size', stat.size);
  line();

  var jq = _.partial(h.jq, _, argv.filename);
  var type = jq('.[0]')._type;
  line('[' + type + ']');

  switch (type) {
    case 'item':  showItems(jq);  break;
    case 'skill': showSkills(jq); break;
  }
};

module.exports = cmd;
