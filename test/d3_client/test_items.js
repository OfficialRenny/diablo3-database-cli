var assert = require('chai').assert;
var nock = require('nock');

var client = require('../../lib/d3_client_en');
var h = require('../../lib/helper');

describe('d3_client_en', function() {
  describe('#items', function() {
    this.timeout(5000);

    var EMPTY_ITEM = {
      id:    '',
      link:  '',
      icon:  '',
      name:  '',
      slot:  '',
      type:  '',
      level: 1,
      owner: '',
      desc2: '',
      attrs: {
        aws:     [],
        effects: [],
        choices: [],
      },
      set: {
        name:   '',
        pieces: [],
        bonus:  [],
      },
      source: {
        cost:      '',
        icon:      '',
        rank:      '',
        materials: [],
      },
    };

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

    it('should get normal item', function(done) {
      nock('http://us.battle.net')
        .get('/d3/en/item/helm-of-the-cranial-crustacean')
        .replyWithFile(200, './test/mock/items/helm.helm-of-the-cranial-crustacean.html.20170131');

      var url = 'http://us.battle.net/d3/en/item/helm-of-the-cranial-crustacean';
      client.getItem(url, function(e, item) {
        assert.equal(e, null);
        assert.deepEqual(item, h.extendObj(EMPTY_ITEM, {
          id:    'helm-of-the-cranial-crustacean',
          link:  'http://us.battle.net/d3/en/item/helm-of-the-cranial-crustacean',
          icon:  'http://media.blizzard.com/d3/icons/items/large/transmoghelm_002_demonhunter_male.png',
          name:  'Helm of the Cranial Crustacean',
          slot:  'Head',
          type:  'Helm',
          level: 1,
          desc2: 'Wear this and you will be mistaken for a mindless zombie — amuse your friends, fool your enemies!',
          attrs: {
            aws: ['21–24', 'Armor'],
          },
        }));

        done();
      });
    });

    it('should get magic item', function(done) {
      nock('http://us.battle.net')
        .get('/d3/en/artisan/blacksmith/recipe/apprentice-coif')
        .replyWithFile(200, './test/mock/items/helm.apprentice-coif.html.20170131');

      var url = 'http://us.battle.net/d3/en/artisan/blacksmith/recipe/apprentice-coif';
      client.getItem(url, function(e, item) {
        assert.equal(e, null);
        assert.deepEqual(item, h.extendObj(EMPTY_ITEM, {
          id:    'apprentice-coif',
          link:  'http://us.battle.net/d3/en/artisan/blacksmith/recipe/apprentice-coif',
          icon:  'http://media.blizzard.com/d3/icons/items/large/helm_003_demonhunter_male.png',
          name:  'Apprentice Coif',
          slot:  'Head',
          type:  'Magic Helm',
          level: 9,
          attrs: {
            aws:     ['36–41', 'Armor'],
            effects: ['+2 Random Magic Properties'],
          },
          source: {
            cost:      '1,000',
            rank:      'Level 1 (Apprentice)',
            materials: [
              {
                count: 4,
                id:    'reusable-parts',
                link:  'http://us.battle.net/d3/en/item/reusable-parts',
                icon:  'http://media.blizzard.com/d3/icons/items/small/crafting_assortedparts_01_demonhunter_male.png',
              },
              {
                count: 4,
                id:    'arcane-dust',
                link:  'http://us.battle.net/d3/en/item/arcane-dust',
                icon:  'http://media.blizzard.com/d3/icons/items/small/crafting_magic_01_demonhunter_male.png',
              },
            ],
          },
        }));

        done();
      });
    });

    it('should get rare item', function(done) {
      nock('http://us.battle.net')
        .get('/d3/en/artisan/blacksmith/recipe/apprentice-arming-cap')
        .replyWithFile(200, './test/mock/items/helm.apprentice-arming-cap.html.20170131');

      var url = 'http://us.battle.net/d3/en/artisan/blacksmith/recipe/apprentice-arming-cap';
      client.getItem(url, function(e, item) {
        assert.equal(e, null);
        assert.deepEqual(item, h.extendObj(EMPTY_ITEM, {
          id:    'apprentice-arming-cap',
          link:  'http://us.battle.net/d3/en/artisan/blacksmith/recipe/apprentice-arming-cap',
          icon:  'http://media.blizzard.com/d3/icons/items/large/helm_004_demonhunter_male.png',
          name:  'Apprentice Arming Cap',
          slot:  'Head',
          type:  'Rare Helm',
          level: 15,
          attrs: {
            aws:     ['54–71', 'Armor'],
            effects: ['+4 Random Magic Properties'],
          },
          source: {
            cost:      '1,000',
            rank:      'Level 1 (Apprentice)',
            materials: [
              {
                count: 5,
                id:    'reusable-parts',
                link:  'http://us.battle.net/d3/en/item/reusable-parts',
                icon:  'http://media.blizzard.com/d3/icons/items/small/crafting_assortedparts_01_demonhunter_male.png',
              },
              {
                count: 5,
                id:    'arcane-dust',
                link:  'http://us.battle.net/d3/en/item/arcane-dust',
                icon:  'http://media.blizzard.com/d3/icons/items/small/crafting_magic_01_demonhunter_male.png',
              },
              {
                count: 2,
                id:    'veiled-crystal',
                link:  'http://us.battle.net/d3/en/item/veiled-crystal',
                icon:  'http://media.blizzard.com/d3/icons/items/small/crafting_rare_01_demonhunter_male.png',
              },
            ],
          },
        }));

        done();
      });
    });

    it('should get legendary item', function(done) {
      nock('http://us.battle.net')
        .get('/d3/en/item/leorics-crown')
        .replyWithFile(200, './test/mock/items/helm.leorics-crown.html.20170131');

      var url = 'http://us.battle.net/d3/en/item/leorics-crown';
      client.getItem(url, function(e, item) {
        assert.equal(e, null);
        assert.deepEqual(item, h.extendObj(EMPTY_ITEM, {
          id:    'leorics-crown',
          link:  'http://us.battle.net/d3/en/item/leorics-crown',
          icon:  'http://media.blizzard.com/d3/icons/items/large/unique_helm_002_p1_demonhunter_male.png',
          name:  'Leoric\'s Crown',
          slot:  'Head',
          type:  'Legendary Helm',
          level: 1,
          desc2: 'The crown of the Black King. The taint of his madness wafts from the metal, ' +
                 'clinging to any jewel that comes near it.',
          attrs: {
            aws:     ['72–89', 'Armor'],
            effects: [
              'Increase the effect of any gem socketed into this item by 75–100%. ' +
              'This effect does not apply to Legendary Gems.',
              '+3 Random Magic Properties',
              'Empty Socket',
            ],
            choices: [
              '+18–26 Dexterity',
              '+18–26 Strength',
              '+18–26 Intelligence',
            ],
          },
        }));

        done();
      });
    });

    it('should get set item', function(done) {
      nock('http://us.battle.net')
        .get('/d3/en/artisan/blacksmith/recipe/cains-laurel')
        .replyWithFile(200, './test/mock/items/helm.cains-laurel.html.20170131');

      var url = 'http://us.battle.net/d3/en/artisan/blacksmith/recipe/cains-laurel';
      client.getItem(url, function(e, item) {
        assert.equal(e, null);
        assert.deepEqual(item, h.extendObj(EMPTY_ITEM, {
          id:    'cains-laurel',
          link:  'http://us.battle.net/d3/en/artisan/blacksmith/recipe/cains-laurel',
          icon:  'http://media.blizzard.com/d3/icons/items/large/unique_helm_012_1xx_demonhunter_male.png',
          name:  'Cain\'s Memory',
          slot:  'Head',
          type:  'Set Helm',
          level: 23,
          desc2: 'This laurel represents the wisdom of the scholar Deckard Cain.',
          attrs: {
            aws:     ['72–89', 'Armor'],
            effects: [
              'Critical Hit Chance Increased by 2.5–3.0%',
              '+4 Random Magic Properties',
              'Empty Socket',
            ],
          },
          set: {
            name:   'Cain\'s Fate',
            pieces: [
              {
                id:   'cains-laurel',
                name: 'Cain\'s Memory',
                link: 'http://us.battle.net/d3/en/artisan/blacksmith/recipe/cains-laurel',
              },
              {
                id:   'cains-raiment',
                name: 'Cain\'s Robes',
                link: 'http://us.battle.net/d3/en/artisan/blacksmith/recipe/cains-raiment',
              },
              {
                id:   'cains-slippers',
                name: 'Cain\'s Sandals',
                link: 'http://us.battle.net/d3/en/artisan/blacksmith/recipe/cains-slippers',
              },
              {
                id:   'cains-warmers',
                name: 'Cain\'s Scribe',
                link: 'http://us.battle.net/d3/en/artisan/blacksmith/recipe/cains-warmers',
              },
            ],
            bonus: [
              {
                count: 2,
                desc:  [
                  'Attack Speed Increased by 2.0%',
                ],
              },
              {
                count: 3,
                desc:  [
                  '10% Better Chance of Finding Magical Items',
                  '+50% Experience. (5.0% at level 70)',
                ],
              },
            ],
          },
          source: {
            cost: '7,000',
            rank: 'Level 4 (Master)',
            icon: 'http://media.blizzard.com/d3/icons/items/small/' +
                  'craftingplan_smith_t04_legendary_set_normal_002_demonhunter_male.png',

            materials: [
              {
                count: 15,
                id:    'reusable-parts',
                link:  'http://us.battle.net/d3/en/item/reusable-parts',
                icon:  'http://media.blizzard.com/d3/icons/items/small/crafting_assortedparts_01_demonhunter_male.png',
              },
              {
                count: 15,
                id:    'arcane-dust',
                link:  'http://us.battle.net/d3/en/item/arcane-dust',
                icon:  'http://media.blizzard.com/d3/icons/items/small/crafting_magic_01_demonhunter_male.png',
              },
              {
                count: 10,
                id:    'veiled-crystal',
                link:  'http://us.battle.net/d3/en/item/veiled-crystal',
                icon:  'http://media.blizzard.com/d3/icons/items/small/crafting_rare_01_demonhunter_male.png',
              },
            ],
          },
        }));

        done();
      });
    });

    it('should get specific weapon for Monk', function(done) {
      nock('http://us.battle.net')
        .get('/d3/en/item/balance')
        .replyWithFile(200, './test/mock/items/daibo.balance.html.20170201');

      var url = 'http://us.battle.net/d3/en/item/balance';
      client.getItem(url, function(e, item) {
        assert.equal(e, null);
        assert.deepEqual(item, h.extendObj(EMPTY_ITEM, {
          id:    'balance',
          link:  'http://us.battle.net/d3/en/item/balance',
          icon:  'http://media.blizzard.com/d3/icons/items/large/p4_unique_combatstaff_2h_001_demonhunter_male.png',
          name:  'Balance',
          slot:  '2-Hand',
          type:  'Legendary Daibo',
          level: 9,
          owner: 'Monk',
          desc2: '"We must walk the middle way between chaos and order, and not allow our emotions to sway us."' +
                 ' —Tenets of the Veradani',
          attrs: {
            aws: [
              '55.0–56.7',
              'Damage Per Second',
              '(37–38)–(63–65) Damage',
              '1.10 Attacks per Second',
            ],
            effects: [
              '+(8–9)–(10–12) Holy Damage',
              '+41–53 Dexterity',
              'Increases Tempest Rush Damage by 150–200% (Monk Only)',
              'When your Tempest Rush hits 3 or fewer enemies, it gains 100% Critical Hit Chance.',
              '+3 Random Magic Properties',
            ],
          },
        }));

        done();
      });
    });
  }); // #items
});
