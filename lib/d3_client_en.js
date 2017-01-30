var _ = require('underscore');
var cheerio = require('cheerio');

var config = require('./config_en');
var h = require('./helper');

var d3client = {};

// @param cid - Class ID.
// @param isActive - true for active skills, false for passive skills.
d3client.getSkills = function(cid, isActive, cb) {
  var url = isActive ? config.SKILLS.ACTIVE : config.SKILLS.PASSIVE;
  url = url.replace('$id', cid);
  h.http(url, function(e, body) {
    if (e) return cb(e);

    var $ = cheerio.load(body);
    var skills = $('table tbody tr[class*=row1], [class*=row2]').map(function() {
      var skill = {
        desc: [],
      };

      var tds = $(this).children('td');

      // 1st td: level
      skill.level = +$(tds[0]).find('h3[class=subheader-3]').text();

      // 2nd td: other details
      var tags = $(tds[1]).find('div[class=skill-details]').children();
      skill.icon = h.url($(tags[0]).find('span[class*=d3-icon]').attr('style'));
      skill.link = config.BASE_URL + $(tags[1]).find('a').attr('href');
      skill.id = skill.link.split('/').pop();
      skill.name = $(tags[1]).text().trim();
      skill.category = $(tds[1]).find('div[class=skill-category]').text().trim();

      $(tds[1]).find('div[class=skill-description]').find('p').each(function() {
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

      // 3rd td: runes
      skill.runes = $(tds[2]).find('li').map(function() {
        var tags = $(this).children();
        var rune = {
          type: $(tags[0]).find('span').attr('class'),
          name: $(tags[1]).text().trim(),
        };
        return rune;
      }).get();

      return skill;
    }).get();

    return cb(null, skills);
  });
};

// @param cid - Class ID.
// @param sid - Skill ID.
d3client.getSkill = function(cid, sid) {
};

module.exports = d3client;
