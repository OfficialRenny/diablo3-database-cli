var CONFIG = {
  BASE_URL: 'http://us.battle.net',

  CLASSES: [
    'barbarian',
    'crusader',
    'demon-hunter',
    'monk',
    'witch-doctor',
    'wizard',
  ],

  QUALITIES: [
    {
      name:  'Normal',
      color: 'white',
    },
    {
      name:  'Magic',
      color: 'blue',
    },
    {
      name:  'Rare',
      color: 'yellow',
    },
    {
      name:  'Legendary',
      color: 'orange',
    },
    {
      name:  'Set',
      color: 'green',
    },
  ],

  SKILLS: {
    ACTIVE:  'http://us.battle.net/d3/en/class/$id/active/',
    PASSIVE: 'http://us.battle.net/d3/en/class/$id/passive/',
  },

  ITEMS: {
    GROUPS: 'http://us.battle.net/d3/en/item/',
    ITEMS:  'http://us.battle.net/d3/en/item/$id/',
  },
};

module.exports = CONFIG;
