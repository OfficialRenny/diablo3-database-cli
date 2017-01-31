var assert = require('chai').assert;

var client = require('../../lib/d3_client_en');

describe('d3_client_en', function() {
  describe('#items', function() {
    it('should get item groups', function(done) {
      var url = 'http://us.battle.net/d3/en/item/';
      client.getItemGroups(url, function(e, groups) {
        assert.equal(e, null);
        assert.equal(groups.length, 49);

        assert.deepEqual(groups[48], {
          name: 'Pages of Training',
          link: 'http://us.battle.net/d3/en/item/page-of-training/',
        });

        done();
      });
    });
  });
});
