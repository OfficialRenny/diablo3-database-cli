var _ = require('underscore');
var cheerio = require('cheerio');

var config = require('./config_en');
var h = require('./helper');

var d3client = {};

d3client.getSkills = function(url, cb) {
  h.http(url, function(e, body) {
    if (e) return cb(e);

    var $ = h.cheerio(cheerio.load(body));
    var skills = $('table >tbody >tr[class*=row1], [class*=row2]').map(function() {
      var skill = {
        link: $(this).find('div[class=skill-details] >h3 >a').attr('href'),
        name: $(this).find('div[class=skill-details] >h3').d3_text(),
      };
      skill.link = config.BASE_URL + skill.link;
      skill.id = skill.link.split('/').pop();

      return skill;
    }).get();

    return cb(null, skills);
  });
};

d3client.getSkill = function(url, cb) {
  h.http(url, function(e, body) {
    if (e) return cb(e);

    var $ = h.cheerio(cheerio.load(body));
    var parts = url.split('/').reverse();
    var skill = {
      id:     parts[0],
      active: parts[1] == 'active',
      owner:  parts[2],
      link:   url,
      desc:   [],
    };

    // skill details
    skill.icon = h.url($('div[class*=skill-detail] span[class*=d3-icon]').attr('style'));
    skill.level = +$('span[class=detail-level-unlock]').d3_text();
    skill.name = $('div[class=detail-level]').next('h2').d3_text();
    skill.category = $('div[class=skill-category]').d3_text();
    skill.legend = $('div[class=db-flavor-text]').d3_text();

    $('div[class=skill-desc]').find('p').each(function() {
      var s = $(this).d3_text();
      var res = h.splitBy(s, ['Cost:', 'Cooldown:', 'Generate:'], function(k, v) {
        k = k.slice(0, -1).toLowerCase();
        v = v.trim();
        return [k, v];
      });

      if (_.isObject(res)) {
        _.extendOwn(skill, res);  // merge special attributes
      } else {
        skill.desc.push(res);
      }
    });

    // skill runes
    skill.runes = $('div[class*=rune-list] tbody tr').map(function() {
      var rune = {
        level: +$(this).find('td[class*=column-level]').d3_text(),
        type:  $(this).find('div[class=rune-type] >span >span').attr('class'),
        name:  $(this).find('div[class=rune-desc]').prev().d3_text(),
        desc:  $(this).find('div[class=rune-desc]').d3_text(),
      };
      return rune;
    }).get();

    return cb(null, skill);
  });
};

d3client.getItemGroups = function(url, cb) {
  h.http(url, function(e, body) {
    if (e) return cb(e);

    var $ = h.cheerio(cheerio.load(body));

    var groups = [];
    $('div[class=box]').each(function() {
      $(this).find('a').each(function() {
        // FIXME: better solution?
        $(this).find('span').remove();

        var group = {
          name: $(this).d3_text(),
          link: $(this).attr('href'),
        };
        group.link = config.BASE_URL + group.link;
        groups.push(group);
      });
    });

    return cb(null, groups);
  });
};

d3client.getItemsInGroup = function(url, cb) {
  h.http(url, function(e, body) {
    if (e) return cb(e);

    var $ = h.cheerio(cheerio.load(body));

    var items = $('div[class=item-details]').map(function() {
      var item = {
        name: $(this).find('h3 a').d3_text(),
        link: $(this).find('h3 a').attr('href'),
      };
      item.id = item.link.split('/').pop();
      item.link = config.BASE_URL + item.link;
      return item;
    }).get();

    var items2 = $('div[class=data-cell]').map(function() {
      var item = {
        link: $(this).find('a').attr('href'),
      };
      item.id = item.link.split('/').pop();
      item.link = config.BASE_URL + item.link;
      return item;
    }).get();

    return cb(null, items.concat(items2));
  });
};

d3client.getItem = function(url, cb) {
  h.http(url, function(e, body) {
    if (e) return cb(e);

    var $ = h.cheerio(cheerio.load(body));

    var item = {
      id:     url.split('/').pop(),
      link:   url,
      icon:   h.url($('div[class*=detail-icon] >span >span >span').attr('style')),
      color:  $('div[class*=detail-icon] >span').attr('class').split('-').pop(),
      level:  +$('span[class=detail-level-number]').d3_text(),
      name:   $('div[class=detail-text] h2').d3_text(),
      slot:   $('li[class=item-slot]').d3_text(),
      type:   $('ul[class=item-type]').d3_text(),
      owner:  $('li[class*=item-class-specific]').d3_text(),
      desc:   $('div[class*=item-description]').d3_text(),
      legend: $('div[class=db-flavor-text]').d3_text(),
      unique: $('span[class=item-unique-equipped]').d3_text() == 'Unique Equipped',

      attrs: {
        aws: $('ul[class*=item-armor-weapon] li').map(function() {
               return $(this).d3_text();
             }).get(),
        effects: $('ul[class=item-effects] >li[class!=item-effects-choice]').map(function() {
                   return $(this).d3_text();
                 }).get(),
        choices: $('li[class=item-effects-choice] >ul >li').map(function() {
                   return $(this).d3_text();
                 }).get(),
        extras: $('ul[class=item-extras] >li').map(function() {
                  return $(this).d3_text();
                }).get(),
      },

      set: {
        name:  $('li[class=item-itemset-name]').d3_text(),
        parts: $('li[class*=item-itemset-piece]').map(function() {
                 var part = {
                   name: $(this).d3_text(),
                   link: $(this).find('a').attr('href'),
                 };
                 part.id = part.link.split('/').pop();
                 part.link = config.BASE_URL + part.link;
                 return part;
               }).get(),
        bonus: $('li[class*=item-itemset-bonus-amount]').map(function() {
                 return {
                   num:   +$(this).find('span[class=value]').d3_text(),
                   attrs: $(this).nextUntil('li[class*=item-itemset-bonus-amount]').map(function() {
                            return $(this).d3_text();
                          }).get(),
                 };
               }).get(),
      },

      source: {
        cost: $('div[class=source-costs] >span[class=cost]').d3_text(),
        icon: h.url($('div[class=source-text] >span >span >span').attr('style')),
        rank: $('div[class=source-text] >div[class=plan] >span[class=rank]').d3_text(),

        parts: $('div[class=recipe-materials] >a').map(function() {
                 var part = {
                   num:  +$(this).find('span[class=d3-num]').d3_text(),
                   link: $(this).attr('href'),
                   icon: h.url($(this).find('>span >span >span').attr('style')),
                 };
                 part.id = part.link.split('/').pop();
                 part.link = config.BASE_URL + part.link;
                 return part;
               }).get(),
      },
    };

    var guessed = 'Normal';
    config.QUALITIES.forEach(function(q) {
      // extract quality from type, e.g. "Magic xxx".
      if (item.type.startsWith(q.name + ' ')) {
        item.quality = q.name;
        item.type = item.type.substr(q.name.length + 1);
      }

      // but material has fixed type = 'Crafting Material',
      // have to guess quality from icon color!
      if (item.color == q.color)
        guessed = q.name;
    });
    item.quality = item.quality || guessed;

    item.bound = (item.attrs.extras.indexOf('Account Bound') >= 0);

    return cb(null, item);
  });
};

module.exports = d3client;
