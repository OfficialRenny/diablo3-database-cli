var fs = require('fs');

var _ = require('underscore');

var config = require('./config_en');
var client = require('./d3_client_en');
var DB = require('./db');
var Queue = require('./queue');
var h = require('./helper');

function DBWorker(type, outdir, concurrency) {
  this.type = type;
  this.outdir = outdir;
  this.concurrency = concurrency;

  this.dbdir = outdir + '/databases/';
  this.imagedir = outdir + '/images/';
  if (!fs.existsSync(this.dbdir))
    fs.mkdirSync(this.dbdir);
  if (!fs.existsSync(this.imagedir))
    fs.mkdirSync(this.imagedir);
};

DBWorker.prototype.run = function(cb) {
  this.q = new Queue();
  this.db = new DB(this.dbdir + this.type + '.json', this.type);

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
  var imagedir = this.imagedir;

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
      skills.forEach(function(_skill) {
        var f2 = _.bind(client.getSkill, client, _skill.link);
        var cb2 = function(e, skill) {
          if (e) return q.put(f2, cb2);

          console.log(_skill.link);
          db.add(skill);

          var f3 = _.bind(h.download, h, skill.icon, imagedir);
          var cb3 = function(e, state) {
            if (e) return q.put(f3, cb3);

            console.log(skill.icon, state);
          };
          q.put(f3, cb3);
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
  var imagedir = this.imagedir;

  var f = _.bind(client.getItemGroups, client, config.ITEMS.GROUPS);
  var cb = function(e, groups) {
    if (e) return q.put(f, cb);

    groups.forEach(function(group) {
      var f2 = _.bind(client.getItemsInGroup, client, group.link);
      var cb2 = function(e, items) {
        if (e) return q.put(f2, cb2);

        items.forEach(function(_item) {
          var f3 = _.bind(client.getItem, client, _item.link);
          var cb3 = function(e, item) {
            if (e) return q.put(f3, cb3);

            console.log(_item.link);
            db.add(item);

            var f4 = _.bind(h.download, h, item.icon, imagedir);
            var cb4 = function(e, state) {
              if (e) return q.put(f4, cb4);

              console.log(item.icon, state);
            };
            q.put(f4, cb4);
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
