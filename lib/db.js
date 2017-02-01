var fs = require('fs');

function DB(name, type) {
  this.name = name;
  this.type = type;

  this.file = fs.createWriteStream(name);
  var meta = {
    _type: type,
  };
  this.file.write('[');
  this.file.write(JSON.stringify(meta));
}

DB.prototype.add = function(obj) {
  this.file.write(',');
  this.file.write(JSON.stringify(obj));
};

DB.prototype.close = function() {
  this.file.write(']');
  this.file.end();
};

module.exports = DB;
