var _ = require('underscore');

var config = require('./config_en');
var client = require('./d3_client_en');
var DB = require('./db');
var Queue = require('./queue');

function DBWorker(type, outdir, concurrency) {
  this.type = type;
  this.outdir = outdir;
  this.concurrency = concurrency;
};

DBWorker.prototype.run = function(cb) {
  this.q = new Queue();
  this.db = new DB(this.outdir + '/' + this.type + '.json', this.type);

  // TODO: use different classes if needed.
  switch (this.type) {
    case 'item':  this.getItems();  break;
    case 'skill': this.getSkills(); break;
    default:                        break;
  }

  var db = this.db;
  this.q.run(this.concurrency, function() {
    db.close();
    cb(db.name);
  });
};

DBWorker.prototype.getSkills = function() {
  var q = this.q;
  var db = this.db;

  var urls = [];
  config.CLASSES.forEach(function(id) {
    urls.push(config.SKILLS.ACTIVE.replace('$id', id));
    urls.push(config.SKILLS.PASSIVE.replace('$id', id));
  });

  urls.forEach(function(url) {
    var f = _.bind(client.getSkills, client, url);
    var cb = function(e, skills) {
      // TODO: set retry limit?
      if (e) return q.put(f, cb);

      console.log(url, skills.length);
      skills.forEach(function(skill) {
        var f2 = _.bind(client.getSkill, client, skill.link);
        var cb2 = function(e, skill2) {
          if (e) return q.put(f2, cb2);

          console.log(skill.link);
          db.add(skill2);
        };
        q.put(f2, cb2);
      });
    };
    q.put(f, cb);
  });
};

DBWorker.prototype.getItems = function() {
  var q = this.q;
  var db = this.db;

  var f = _.bind(client.getItemGroups, client, config.ITEMS.GROUPS);
  var cb = function(e, groups) {
    if (e) return q.put(f, cb);

    groups.forEach(function(group) {
      var f2 = _.bind(client.getItemsInGroup, client, group.link);
      var cb2 = function(e, items) {
        if (e) return q.put(f2, cb2);

        items.forEach(function(item) {
          var f3 = _.bind(client.getItem, client, item.link);
          var cb3 = function(e, item2) {
            if (e) return q.put(f3, cb3);

            console.log(item.link);
            db.add(item2);
          };
          q.put(f3, cb3);
        });
      };
      q.put(f2, cb2);
    });
  };
  q.put(f, cb);
};

module.exports = DBWorker;
