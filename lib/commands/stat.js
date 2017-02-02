var fs = require('fs');

var _ = require('underscore');
var sprintf = require('sprintf-js').sprintf;

var config = require('../config_en');
var h = require('../helper');

var cmd = {
  command: 'stat <filename>',
  desc:    '',
  builder: {
  },
};

var SPLIT = '-'.repeat(30);
var BAR = '-'.repeat(15);

function line(name, value) {
  if (value === 0) value = '0';
  console.log(sprintf('%-30s%15s', name || '', value || ''));
}

function lines(groups) {
  var sum = 0;
  groups.forEach(function(group) {
    line(group.k, group.v);
    sum += group.v;
  });
  line(SPLIT, BAR);
  line('Total', sum);
  line();
}

function showSkills(jq) {
  line('All', jq('.[1:] | length'));
  line();

  lines(jq('.[1:] | ' +
           'group_by(.owner) | ' +
           'map({' +
           '  k: .[0].owner,' +
           '  v: . | length' +
           '})'));

  line('[SANITY]');
  line(SPLIT, BAR);
  // empty
  line('Empty id', jq('.[1:] | map(select(.id == "")) | length'));
  line('Empty name', jq('.[1:] | map(select(.name == "")) | length'));
  line();

  // number
  line('Invalid level', jq('.[1:] | map(select(.level < 1)) | length'));
  line();

  // regexp
  line('Invalid link',
       jq('.[1:] | map(select(.link | test("http://.*"; "i") | not)) | length'));
  line('Invalid icon',
       jq('.[1:] | map(select(.icon | test("http://.*\.png"; "i") | not)) | length'));
  line();

  // enum
  line('Unknown owner',
       jq('.[1:] | map(select([.owner] | inside(' +
          '["barbarian","crusader","demon-hunter","monk","witch-doctor","wizard"]' +
          ') | not)) | length'));
  line();

  // runes
  line('Active w/o runes',
       jq('map(select((.active == true) and (.runes | any? | not))) | length'));
  line('Passive w/ runes',
       jq('map(select((.active == false) and (.runes | any?))) | length'));
  line('Not 5 runes',
       jq('map(select((.active == true) and (.runes | length) != 5)) | length'));
}

function showItems(jq) {
  line('All', jq('.[1:] | length'));
  line('Set Group', jq('.[1:] | sort_by(.set.name) | map(.set.name) | unique | length'));
  line();

  var groups = config.QUALITIES.map(function(q) {
    return {
      k: q.name,
      v: jq('.[1:] | map(select(.quality == "' + q.name + '")) | length'),
    };
  });
  lines(groups);

  lines(jq('.[1:] | ' +
           'map(select(.owner != "")) | ' +
           'group_by(.owner) | ' +
           'map({' +
           '  k: .[0].owner,' +
           '  v: . | length' +
           '})'));

  lines(jq('.[1:] | ' +
           'map(select(.type != "")) | ' +
           'group_by(.type) | ' +
           'map({' +
           '  k: .[0].type,' +
           '  v: . | length' +
           '})'));

  line('[SANITY]');
  line(SPLIT, BAR);
  // empty
  line('Empty id',
       jq('.[1:] | map(select(.id == "")) | length'));
  line('Empty name',
       jq('.[1:] | map(select(.name == "")) | length'));
  line('Empty id in set part',
       jq('.[1:] | map(.set.parts) | flatten | map(select(.id == "")) | length'));
  line('Empty id in source part',
       jq('.[1:] | map(.source.parts) | flatten | map(select(.id == "")) | length'));
  line();

  // number
  line('Invalid level',
       jq('.[1:] | map(select(.level < 1)) | length'));
  line('Invalid num in set bonus',
       jq('.[1:] | map(.set.bonus) | flatten | map(select(.num < 2 or .num > 6)) | length'));
  line('Invalid num in source parts',
       jq('.[1:] | map(.source.parts) | flatten | map(select(.num < 1)) | length'));
  line();

  // regexp
  line('Invalid link',
       jq('.[1:] | map(select(.link | test("http://.*"; "i") | not)) | length'));
  line('Invalid icon',
       jq('.[1:] | map(select(.icon | test("http://.*\.png"; "i") | not)) | length'));
  line('Invalid link in set part',
       jq('.[1:] | map(.set.parts) | flatten | map(select(.link | test("http://.*"; "i") | not)) | length'));
  line('Invalid link in source part',
       jq('.[1:] | map(.source.parts) | flatten | map(select(.link | test("http://.*"; "i") | not)) | length'));
  line();

  // enum
  line('Unknown color',
       jq('.[1:] | map(select([.color] | inside(' +
          '["white","blue","yellow","orange","green","gray"]' +
          ') | not)) | length'));
  line('Unknown quality',
       jq('.[1:] | map(select([.quality] | inside(' +
          '["Normal","Magic","Rare","Legendary","Set"]' +
          ') | not)) | length'));
  line();

  // Set
  line('No parts in set',
       jq('.[1:] | map(select(.set.name != "" and (.set.parts | any? | not))) | length'));
  line('No bonus in set',
       jq('.[1:] | map(select(.set.name != "" and (.set.bonus | any? | not))) | length'));
  line();

  // references
  var sub = jq('.[1:] | map(.set.parts) | flatten | map(.id)');
  var all = jq('.[1:] | map(.id)');
  line('Dangling id in set parts', _.difference(sub, all).length);

  sub = jq('.[1:] | map(.source.parts) | flatten | map(.id)');
  all = jq('.[1:] | map(.id)');
  line('Dangling id in source parts', _.difference(sub, all).length);
}

cmd.handler = function(argv) {
  var stat = fs.statSync(argv.filename);
  line('[FILE]');
  line(SPLIT, BAR);
  line('Name', argv.filename);
  line('Size', stat.size);
  line();

  var jq = _.partial(h.jq, _, argv.filename);
  var type = jq('.[0]')._type;
  line('[' + type.toUpperCase() + ']');
  line(SPLIT, BAR);

  switch (type) {
    case 'item':  showItems(jq);  break;
    case 'skill': showSkills(jq); break;
  }
};

module.exports = cmd;
