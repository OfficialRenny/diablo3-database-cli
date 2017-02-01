var fs = require('fs');

function DB(name, type) {
  this.name = name;
  this.type = type;
  this.ids = [];

  this.file = fs.createWriteStream(name);
  var meta = {
    _type: type,
  };
  this.file.write('[');
  this.file.write(JSON.stringify(meta));
}

DB.prototype.add = function(obj) {
  // FIXME: should not be a bottleneck?
  if (this.ids.indexOf(obj.id) >= 0) {
    return;
  }
  this.ids.push(obj.id);

  this.file.write(',');
  this.file.write(JSON.stringify(obj));
};

DB.prototype.close = function() {
  this.file.write(']');
  this.file.end();
};

module.exports = DB;
