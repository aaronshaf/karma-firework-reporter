// For examples
// https://github.com/karma-runner/karma/blob/master/lib/reporters/base.js
// https://github.com/karma-runner/karma-junit-reporter/blob/master/index.js
// https://github.com/karma-runner/karma-growl-reporter/blob/master/index.js

var FireworkReporter = function(formatError, reportSlow) {
  var allMessages = [];
  var suites;
  var lastSuite = null;

  this.adapters = [function(msg) {
    allMessages.push(msg);
  }];

  this.writeCommonMsg = function(msg) {
    console.error('writeCommonMsg');

  }

  this._remove = function() {
    console.error('_remove');
  };

  this._refresh = function() {
    console.error('_refresh');
  };

  this._render = function() {
    console.error('_render');
  };

  this.write = function() {
    console.error('write');
  };

  this.onBrowserStart = function(browser) {
    console.error('onBrowserStart')
    // browser.name
    // browser.id
    // var timestamp = (new Date()).toISOString().substr(0, 19);

  };

  this.renderBrowser = function(browser) {
    conosle.error('renderBrowser');
  }

  this.onRunStart = function(browsers) {
    console.error('onRunStart')
    suites = Object.create(null);
  };

  this.onBrowserComplete = function(browser) {
    console.error('onBrowserComplete')

  };

  this.onRunComplete = function() {
    console.error('onRunComplete')

  };

  this.onSpecComplete = function(browser, result) {
    console.error(JSON.stringify(result))
  };

  this.onBrowserError = function(browser, error) {
    console.error('onBrowserError')
  };

  this.onBrowserLog = function(browser, log, type) {
    console.error('onBrowserLog')
  };

  this.specSuccess = this.specSkipped = this.specFailure = function(browser, result) {
    console.error('result')
    console.log(JSON.stringify(result));
  };

  this.onExit = function(done) {
    console.error('onExit');
    done();
  };
};

FireworkReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper', 'formatError'];

module.exports = {
  'reporter:firework': ['type', FireworkReporter]
};