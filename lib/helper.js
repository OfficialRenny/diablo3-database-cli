var cp = require('child_process');

var _ = require('underscore');
var request = require('request');

var h = {};

// send HTTP request to d3 web.
h.http = function(url, cb) {
  var opts = {
    url:     url,
    timeout: 1000 * 10,
  };
  request(opts, function(e, resp, body) {
    if (e) return cb(e);
    if (resp.statusCode != 200) return cb('HTTP Error');

    return cb(null, body);
  });
};

// parse HTTP URL from given string.
h.url = function(s) {
  if (!s) s = '';

  var m = s.match(/http:\/\/[^'"()]+/);
  if (m) return m[0];

  // TODO: more other cases

  return s;
};

// split string by given delims.
h.splitBy = function(s, delims, cb) {
  var reg = new RegExp('('+ delims.join('|') + ')');
  var parts = s.split(reg);

  if (parts.length == 1) return s;
  if (parts[0] == '') parts.shift();

  var res = [];
  while (parts.length > 0) {
    var p = parts.splice(0, 2);
    if (cb) p = cb(p[0], p[1]);
    res.push(p);
  }
  return _.object(res);
};

h.extendObj = function(from, to) {
  for (var k in from) {
    if (_.isObject(from[k]) && (k in to))
      this.extendObj(from[k], to[k]);
    else if (!(k in to))
      to[k] = from[k];
  }
  return to;
};

h.jq = function(cmd, filename) {
  return JSON.parse(cp.execSync('jq "' + cmd + '" ' + filename));
};

module.exports = h;
