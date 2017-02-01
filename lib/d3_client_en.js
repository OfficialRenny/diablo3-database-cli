var _ = require('underscore');
var cheerio = require('cheerio');

var config = require('./config_en');
var h = require('./helper');

var d3client = {};

d3client.getSkills = function(url, cb) {
  h.http(url, function(e, body) {
    if (e) return cb(e);

    var $ = cheerio.load(body);
    var skills = $('table >tbody >tr[class*=row1], [class*=row2]').map(function() {
      var skill = {
        link: $(this).find('div[class=skill-details] >h3 >a').attr('href'),
        name: $(this).find('div[class=skill-details] >h3').text().trim(),
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

    var $ = cheerio.load(body);
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
    skill.level = +$('span[class=detail-level-unlock]').text().trim();
    skill.name = $('div[class=detail-level]').next('h2').text().trim();
    skill.category = $('div[class=skill-category]').text().trim();
    skill.legend = $('div[class=db-flavor-text]').text().trim();

    $('div[class=skill-desc]').find('p').each(function() {
      var s = $(this).text().trim();
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
        level: +$(this).find('td[class*=column-level]').text().trim(),
        type:  $(this).find('div[class=rune-type] >span >span').attr('class'),
        name:  $(this).find('div[class=rune-desc]').prev().text().trim(),
        desc:  $(this).find('div[class=rune-desc]').text().trim(),
      };
      return rune;
    }).get();

    return cb(null, skill);
  });
};

d3client.getItemGroups = function(url, cb) {
  h.http(url, function(e, body) {
    if (e) return cb(e);

    var $ = cheerio.load(body);

    var groups = [];
    // TODO: support Dyes, Gems, Miscellaneous
    $('ul[class=list-items]').each(function() {
      $(this).find('li').each(function() {
        // FIXME: better solution?
        $(this).find('span').remove();
        var group = {
          name: $(this).text().trim(),
          link: $(this).find('a').attr('href'),
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

    var $ = cheerio.load(body);

    var items = $('div[class=item-details]').map(function() {
      var item = {
        name: $(this).find('h3 a').text().trim(),
        link: $(this).find('h3 a').attr('href'),
      };
      item.link = config.BASE_URL + item.link;
      return item;
    }).get();

    return cb(null, items);
  });
};

d3client.getItem = function(url, cb) {
  h.http(url, function(e, body) {
    if (e) return cb(e);

    var $ = cheerio.load(body);

    var item = {
      id:     url.split('/').pop(),
      link:   url,
      icon:   h.url($('div[class*=detail-icon] >span >span >span').attr('style')),
      level:  +$('span[class=detail-level-number]').text().trim(),
      name:   $('div[class=detail-text] h2').text().trim(),
      slot:   $('li[class=item-slot]').text().trim(),
      type:   $('ul[class=item-type]').text().trim(),
      owner:  $('li[class*=item-class-specific]').text().trim(),
      legend: $('div[class=db-flavor-text]').text().trim(),

      attrs: {
        aws: $('ul[class*=item-armor-weapon] li').map(function() {
               return $(this).text().trim();
             }).get(),
        effects: $('ul[class=item-effects] >li[class!=item-effects-choice]').map(function() {
                   return $(this).text().trim();
                 }).get(),
        choices: $('li[class=item-effects-choice] >ul >li').map(function() {
                   return $(this).text().trim();
                 }).get(),
      },

      set: {
        name:  $('li[class=item-itemset-name]').text().trim(),
        parts: $('li[class*=item-itemset-piece]').map(function() {
                 var part = {
                   name: $(this).text().trim(),
                   link: $(this).find('a').attr('href'),
                 };
                 part.id = part.link.split('/').pop();
                 part.link = config.BASE_URL + part.link;
                 return part;
               }).get(),
        bonus: $('li[class*=item-itemset-bonus-amount]').map(function() {
                 return {
                   num:   +$(this).find('span[class=value]').text().trim(),
                   attrs: $(this).nextUntil('li[class*=item-itemset-bonus-amount]').map(function() {
                            return $(this).text().trim();
                          }).get(),
                 };
               }).get(),
      },

      source: {
        cost: $('div[class=source-costs] >span[class=cost]').text().trim(),
        icon: h.url($('div[class=source-text] >span >span >span').attr('style')),
        rank: $('div[class=source-text] >div[class=plan] >span[class=rank]').text().trim(),

        parts: $('div[class=recipe-materials] >a').map(function() {
                 var part = {
                   num:  +$(this).find('span[class=d3-num]').text().trim(),
                   link: $(this).attr('href'),
                   icon: h.url($(this).find('>span >span >span').attr('style')),
                 };
                 part.id = part.link.split('/').pop();
                 part.link = config.BASE_URL + part.link;
                 return part;
               }).get(),
      },
    };

    item.quality = 'Normal';
    ['Magic', 'Rare', 'Legendary', 'Set'].forEach(function(x) {
      if (item.type.startsWith(x + ' ')) {
        item.quality = x;
        item.type = item.type.substr(x.length + 1);
      }
    });

    return cb(null, item);
  });
};

module.exports = d3client;
