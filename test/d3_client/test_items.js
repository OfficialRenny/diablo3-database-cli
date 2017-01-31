var assert = require('chai').assert;
var nock = require('nock');

var client = require('../../lib/d3_client_en');

describe('d3_client_en', function() {
  describe('#items', function() {
    it('should get item groups', function(done) {
      var url = 'http://us.battle.net/d3/en/item/';
      client.getItemGroups(url, function(e, groups) {
        assert.equal(e, null);
        assert.equal(groups.length, 49);
        assert.deepEqual(groups[0], {
          name: 'Helms',
          link: 'http://us.battle.net/d3/en/item/helm/',
        });
        assert.deepEqual(groups[48], {
          name: 'Pages of Training',
          link: 'http://us.battle.net/d3/en/item/page-of-training/',
        });

        done();
      });
    });

    it('should get items in group', function(done) {
      nock('http://us.battle.net')
        .get('/d3/en/item/helm/')
        .replyWithFile(200, './test/mock/items/helm.html.20170131');

      var url = 'http://us.battle.net/d3/en/item/helm/';
      client.getItemsInGroup(url, function(e, items) {
        assert.equal(e, null);
        assert.equal(items.length, 76);
        assert.deepEqual(items[0], {
          name: 'Helm of the Cranial Crustacean',
          link: 'http://us.battle.net/d3/en/item/helm-of-the-cranial-crustacean',
        });
        assert.deepEqual(items[75], {
          name: 'Vyr\'s Sightless Skull',
          link: 'http://us.battle.net/d3/en/item/vyrs-sightless-skull',
        });

        done();
      });
    });
  }); // #items
});
