var assert = require('chai').assert;
var nock = require('nock');

var client = require('../../lib/d3_client_en');

describe('d3_client_en', function() {
  describe('#skills', function() {
    it('should get active skills list', function(done) {
      nock('http://us.battle.net/d3/en/class/barbarian/active')
        .get('/')
        .replyWithFile(200, './test/mock/skills/barbarian.active.html.20170130');

      client.getSkills('barbarian', true, function(e, skills) {
        assert.equal(e, null);
        assert.equal(skills.length, 23);

        assert.deepEqual(skills[0], {
          desc: [
            'Brutally smash an enemy for 320% weapon damage.',
          ],
          generate: '6 Fury per attack',
          category: 'Primary',
          icon:     'http://media.blizzard.com/d3/icons/skills/64/barbarian_bash.png',
          id:       'bash',
          level:    1,
          link:     'http://us.battle.net/d3/en/class/barbarian/active/bash',
          name:     'Bash',
          runes:    [
            {name: 'Frostbite', type: 'rune-c'},
            {name: 'Onslaught', type: 'rune-a'},
            {name: 'Punish', type: 'rune-b'},
            {name: 'Instigation', type: 'rune-d'},
            {name: 'Pulverize', type: 'rune-e'},
          ],
        });

        assert.deepEqual(skills[22], {
          desc: [
            'Cause a massive avalanche of rocks to fall on an area dealing ' +
            '2400% weapon damage to all enemies caught in its path.',
            'Cooldown is reduced by 1 second for every 25 Fury you spend.',
          ],
          cooldown: '30 seconds',
          category: 'Might',
          icon:     'http://media.blizzard.com/d3/icons/skills/64/x1_barbarian_avalanche_v2.png',
          id:       'avalanche',
          level:    61,
          link:     'http://us.battle.net/d3/en/class/barbarian/active/avalanche',
          name:     'Avalanche',
          runes:    [
            {name: 'Volcano', type: 'rune-c'},
            {name: 'Lahar', type: 'rune-d'},
            {name: 'Snow-Capped Mountain', type: 'rune-b'},
            {name: 'Tectonic Rift', type: 'rune-e'},
            {name: 'Glacier', type: 'rune-a'},
          ],
        });

        done();
      });
    });

    it('should get passive skills list', function(done) {
      nock('http://us.battle.net/d3/en/class/barbarian/passive')
        .get('/')
        .replyWithFile(200, './test/mock/skills/barbarian.passive.html.20170130');

      client.getSkills('barbarian', false, function(e, skills) {
        assert.equal(e, null);
        assert.equal(skills.length, 19);

        assert.deepEqual(skills[0], {
          desc: [
            'When you are healed by a health globe, gain 2% Life regeneration per second ' +
            'and 4% increased movement speed for 15 seconds. This bonus stacks up to 5 times.',
          ],
          category: '',
          icon:     'http://media.blizzard.com/d3/icons/skills/64/barbarian_passive_poundofflesh.png',
          id:       'pound-of-flesh',
          level:    10,
          link:     'http://us.battle.net/d3/en/class/barbarian/passive/pound-of-flesh',
          name:     'Pound of Flesh',
          runes:    [],
        });

        assert.deepEqual(skills[18], {
          desc: [
            'Increase Strength by 1% for 8 seconds after killing or assisting in killing an enemy. ' +
            'This effect stacks up to 25 times.',
          ],
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
  });
});
