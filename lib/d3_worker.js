var _ = require('underscore');

var config = require('./config_en');
var client = require('./d3_client_en');
var DB = require('./db');
var Queue = require('./queue');

var worker = {
  outdir:      '.',
  concurrency: 5,
};

worker.getSkills = function(onDone) {
  var skillsDB = new DB(this.outdir + '/skill.json', 'skill');
  var queue = new Queue();

  var urls = [];
  config.CLASSES.forEach(function(id) {
    urls.push(config.SKILLS.ACTIVE.replace('$id', id));
    urls.push(config.SKILLS.PASSIVE.replace('$id', id));
  });

  // 1. get skills list
  urls.forEach(function(url) {
    var f = _.bind(client.getSkills, client, url);
    var cb = function(e, skills) {
      // TODO: set retry limit?
      if (e) return queue.put(f, cb);

      // 2. get each skill details
      console.log(url, skills.length);
      skills.forEach(function(skill) {
        var f2 = _.bind(client.getSkill, client, skill.link);
        var cb2 = function(e, skill2) {
          // TODO: set retry limit?
          if (e) return queue.put(f2, cb2);

          console.log(skill.link);
          skillsDB.add(skill2);
        };
        queue.put(f2, cb2);
      });
    };
    queue.put(f, cb);
  });

  queue.run(this.concurrency, function() {
    skillsDB.close();
    onDone(skillsDB.name);
  });
};

module.exports = worker;
