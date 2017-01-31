var fs = require('fs');

function DB(filename) {
  this.file = fs.createWriteStream(filename);
  this.file.write('[');
}

DB.prototype.add = function(obj) {
  this.file.write(JSON.stringify(obj) + ',');
};

DB.prototype.close = function() {
  // TODO: avoid the last empty {}?
  this.file.write('{}]');
  this.file.end();
};

module.exports = DB;
