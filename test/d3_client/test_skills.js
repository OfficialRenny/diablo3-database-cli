var assert = require('chai').assert;
var nock = require('nock');

var client = require('../../lib/d3_client_en');

describe('d3_client_en', function() {
  describe('#skills', function() {
    it('should get active skills list', function(done) {
      nock('http://us.battle.net')
        .get('/d3/en/class/barbarian/active/')
        .replyWithFile(200, './test/mock/skills/barbarian.active.html.20170130');

      var url = 'http://us.battle.net/d3/en/class/barbarian/active/';
      client.getSkills(url, function(e, skills) {
        assert.equal(e, null);
        assert.equal(skills.length, 23);
        assert.deepEqual(skills[22], {
          id:   'avalanche',
          link: 'http://us.battle.net/d3/en/class/barbarian/active/avalanche',
          name: 'Avalanche',
        });

        done();
      });
    });

    it('should get passive skills list', function(done) {
      nock('http://us.battle.net')
        .get('/d3/en/class/barbarian/passive/')
        .replyWithFile(200, './test/mock/skills/barbarian.passive.html.20170130');

      var url = 'http://us.battle.net/d3/en/class/barbarian/passive/';
      client.getSkills(url, function(e, skills) {
        assert.equal(e, null);
        assert.equal(skills.length, 19);
        assert.deepEqual(skills[18], {
          id:   'rampage',
          link: 'http://us.battle.net/d3/en/class/barbarian/passive/rampage',
          name: 'Rampage',
        });

        done();
      });
    });

    it('should get active skill details', function(done) {
      nock('http://us.battle.net')
        .get('/d3/en/class/barbarian/active/avalanche')
        .replyWithFile(200, './test/mock/skills/barbarian.avalanche.html.20170131');

      var url = 'http://us.battle.net/d3/en/class/barbarian/active/avalanche';
      client.getSkill(url, function(e, skill) {
        assert.equal(e, null);
        assert.deepEqual(skill, {
          desc: [
            'Cause a massive avalanche of rocks to fall on an area dealing ' +
            '2400% weapon damage to all enemies caught in its path.',
            'Cooldown is reduced by 1 second for every 25 Fury you spend.',
          ],
          desc2:    '',
          active:   true,
          owner:    'barbarian',
          cooldown: '30 seconds',
          category: 'Might',
          icon:     'http://media.blizzard.com/d3/icons/skills/64/x1_barbarian_avalanche_v2.png',
          id:       'avalanche',
          level:    61,
          link:     'http://us.battle.net/d3/en/class/barbarian/active/avalanche',
          name:     'Avalanche',
          runes:    [
            {
              name:  'Volcano',
              type:  'rune-c',
              level: 62,
              desc:  'Chunks of molten lava are randomly launched at nearby enemies, dealing 6600% ' +
                     'weapon damage as Fire over 5 seconds.',
            },
            {
              name:  'Lahar',
              type:  'rune-d',
              level: 63,
              desc:  'Cooldown is reduced by 1 second for every 15 Fury spent.',
            },
            {
              name:  'Snow-Capped Mountain',
              type:  'rune-b',
              level: 65,
              desc:  'Cave-in from both sides pushes enemies together, dealing 2800% weapon damage ' +
                     'as Cold and Slowing them by 60% for 3 seconds.',
            },
            {
              name:  'Tectonic Rift',
              type:  'rune-e',
              level: 67,
              desc:  'Store up to 3 charges of Avalanche.',
            },
            {
              name:  'Glacier',
              type:  'rune-a',
              level: 69,
              desc:  'Giant blocks of ice hit enemies for 2400% weapon damage as Cold and Freeze them.',
            },
          ],
        });

        done();
      });
    });

    it('should get passive skill details', function(done) {
      nock('http://us.battle.net')
        .get('/d3/en/class/barbarian/passive/rampage')
        .replyWithFile(200, './test/mock/skills/barbarian.rampage.html.20170131');

      var url = 'http://us.battle.net/d3/en/class/barbarian/passive/rampage';
      client.getSkill(url, function(e, skill) {
        assert.equal(e, null);
        assert.deepEqual(skill, {
          desc: [
            'Increase Strength by 1% for 8 seconds after killing or assisting in killing an enemy. ' +
            'This effect stacks up to 25 times.',
          ],
          desc2: '"The battle was never ending, sapping our minds and bodies to the point of exhaustion. ' +
                 'But they thrived amidst the carnage, every killing blow renewing their bloodlust. They ' +
                 'couldn\'t be stopped." —Sergeant Peshkov on the Siege of the Barbarians, 1123 Anno Kehjistani',
          active:   false,
          owner:    'barbarian',
          category: '',
          icon:     'http://media.blizzard.com/d3/icons/skills/64/x1_barbarian_passive_rampage.png',
          id:       'rampage',
          level:    68,
          link:     'http://us.battle.net/d3/en/class/barbarian/passive/rampage',
          name:     'Rampage',
          runes:    [],
        });

        done();
      });
    });
  }); // #skills
});
