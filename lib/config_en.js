var CONFIG = {
  BASE_URL: 'https://us.diablo3.com',

  CLASSES: [
    'barbarian',
    'crusader',
    'demon-hunter',
    'monk',
    'witch-doctor',
    'wizard',
    'necromancer',
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
    ACTIVE:  'https://us.diablo3.com/en/class/$id/active/',
    PASSIVE: 'https://us.diablo3.com/en/class/$id/passive/',
  },

  ITEMS: {
    GROUPS: 'https://us.diablo3.com/en/item/',
    ITEMS:  'https://us.diablo3.com/en/item/$id',
  },
};

module.exports = CONFIG;
