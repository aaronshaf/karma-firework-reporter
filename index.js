// For examples
// https://github.com/karma-runner/karma/blob/master/lib/reporters/base.js
// e
// https://github.com/karma-runner/karma-growl-reporter/blob/master/index.js

var request = require('request');
var RSVP = require('rsvp');
var uuid = require('node-uuid');

var ENV = {
  FIREWORK_URL: "http://10.0.10.117:3005/",
  GERRIT_PROJECT: "foo",
  GERRIT_PATCHSET_NUMBER: "1",
  GERRIT_CHANGE_URL: "WAT",
  JOB_NAME: "bar",
  BUILD_NUMBER: "2",
  BUILD_URL: "YES"
};

var FireworkReporter = function(baseReporterDecorator, config, logger, helper, formatError) {
  var collector;
  var queue = new RSVP.Promise(function(resolve,reject) {resolve()});

  baseReporterDecorator(this);

  // this.onBrowserStart = function(browser) {
  //   console.log('onBrowserStart')
  //   // browser.name
  //   // browser.id
  //   // var timestamp = (new Date()).toISOString().substr(0, 19);
  // };

  this.onRunStart = function(browsers) {
    suites = Object.create(null);
    console.log('onRunStart');

    collector = {
      id: uuid.v1(),
      project: ENV.GERRIT_PROJECT,
      results: []
    };

    if (ENV.GERRIT_CHANGE_NUMBER) {
      collector.run = {};
      collector.run.gerrit_change_id = ENV.GERRIT_CHANGE_NUMBER;
      if (ENV.GERRIT_PATCHSET_NUMBER) collector.run.gerrit_change_patchset = ENV.GERRIT_PATCHSET_NUMBER;
      if (ENV.GERRIT_CHANGE_URL) collector.run.url = ENV.GERRIT_CHANGE_URL;
    }

    if (ENV.JOB_NAME) {
      collector.build = {};
      collector.build.ci_project = ENV.JOB_NAME;
      if (ENV.BUILD_NUMBER) collector.build.ci_build_id = ENV.BUILD_NUMBER;
      if (ENV.BUILD_URL) collector.build.url = ENV.BUILD_URL;
    }
  };

  this.onSpecComplete = function(browser, result) {
    if(result.log && result.log.length) {
      result.log.forEach(function(log,index) {
        result.log[index] = parseLog(log)
      });
    }

    collector.results.push({
      browser: browser,
      result: result
    });
  };

  this.onBrowserError = function(browser, error) {
    console.log('browser error');
  };

  this.onBrowserLog = function(browser, log, type) {
    collector.results.push({
      browser: browser,
      log: log,
      type: type
    });
  };

  this.specSuccess = this.specSkipped = this.specFailure = function(browser, result) {
    console.log('noooooo')
  //   console.log(JSON.stringify(browser));
  //   console.log(JSON.stringify(result));
  };

  this.postResults = function() {
    console.log(JSON.stringify(collector,null,2));
    var promise = new RSVP.Promise(function(resolve,reject) {
      request({
        method: 'POST',
        url: ENV.FIREWORK_URL,
        body: JSON.stringify(collector)
      }, function(error, response, body) {
        resolve();
      });      
    });
    collector = null;
    return promise;
  };

  this.onRunComplete = function() {
    // console.log('[FIREWORK] sending ' + collector.results.length + ' results to firework');
    queue.then(this.postResults);
  };

  this.onExit = function(done) {
    console.log('onExit');
    queue.then(done);
  };
};

FireworkReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper', 'formatError'];

module.exports = {
  'reporter:firework': ['type', FireworkReporter]
};

function extractTrace(lines) {
  var traceLines = [];
  while(lines.length && lines[lines.length - 1].trim().indexOf('at ') === 0) {
     traceLines.push(lines.pop());
  }
  return traceLines;
}

function extractSection(text,lines) {
  for(var x = 0;x < lines.length;x++) {
    if(lines[x].indexOf(text) === 0) {
      lines[x] = lines[x].substr(text.length);
      return lines.splice(x);
    }
  }
  return [];  
}

function parseLog(value) {
  var data = {};
  
  var lines = value.match(/[^\r\n]+/g);
  
  var traceLines = extractTrace(lines);
  if(traceLines) data.stack = traceLines;
  
  var actual = extractSection('Actual: ',lines);
  if(actual.length) data.actual = actual;
  
  var expected = extractSection('Expected: ',lines);
  if(expected.length) data.expected = expected;
  
  if(lines.length) data.description = lines;
  
  return data;
}