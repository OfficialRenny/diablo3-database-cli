var assert = require('chai').assert;

var h = require('../lib/helper');

describe('helper', function() {
  describe('#url', function() {
    it('should parse ok', function() {
      [
        ['<a href="http://www.com/1.html"></a>', 'http://www.com/1.html'],
        ['<a href=\'http://www.com/2.html\'></a>', 'http://www.com/2.html'],
      ].forEach(function(p) {
        assert.equal(h.url(p[0]), p[1]);
      });
    });
  });
});
