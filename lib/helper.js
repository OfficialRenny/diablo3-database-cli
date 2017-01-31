var _ = require('underscore');
var request = require('request');

var h = {};

// send HTTP request to d3 web.
h.http = function(url, cb) {
  request(url, function(e, resp, body) {
    if (e) return cb(e);
    if (resp.statusCode != 200) return cb('HTTP Error');

    return cb(null, body);
  });
};

// parse HTTP URL from given string.
h.url = function(s) {
  var m = s.match(/http:\/\/[^'"]+/);
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

module.exports = h;