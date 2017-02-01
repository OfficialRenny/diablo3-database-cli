var _ = require('underscore');

function Queue() {
  this.tasks = [];
}

Queue.prototype.put = function(f, cb) {
  this.tasks.push([f, cb]);
};

Queue.prototype.get = function() {
  return (this.tasks.length > 0) ? this.tasks.shift() : [null, null];
};

Queue.prototype.run = function(concurrency, onComplete) {
  this.onComplete = onComplete;
  this.runningWorkers = concurrency;
  this.runningTasks = 0;

  for (var i = 0; i < concurrency; ++i)
    this.workerRun(i);
};

Queue.prototype.workerRun = function(i) {
  var job = this.get();
  var f = job[0];
  var cb = job[1];

  // let worker quit if no more tasks
  if (this.runningTasks === 0 && !f) {
    if (--this.runningWorkers === 0)
      this.onComplete();
    return;
  }

  if (f) {
    var self = this;

    ++this.runningTasks;
    f(function() {
      cb.apply(cb, Array.prototype.slice.call(arguments));
      --self.runningTasks;
    });
  }

  setImmediate(_.bind(this.workerRun, this, i));
};

module.exports = Queue;
