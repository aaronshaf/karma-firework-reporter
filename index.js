var request = require('request');
var Collector = require('./lib/Collector');
var extend = require('lodash').extend;
var request = require('request');
var ENV = process.env;
var NOOP = function() {};

var defaults = {
  fireworkUrl: ENV.FIREWORK_URL
};

var FireworkReporter = function(config, logLevel, emitter, karmaLogger, helper) {
  var collector, adapter;
  var done = NOOP;
  var isPostingResults = false;
  var logger = karmaLogger.create("karma-firework", logLevel);

  function postResults(done) {
    isPostingResults = true;
    emitter.emit('firework_submitting');
    logger.info('submitting ' + collector.getSize() + ' results to Firework...');

    request.post({
      url: config.fireworkUrl.replace(/\/?$/, '') + '/api/result_batch',
      body: collector.toJSON()
    }, function(/*error, response, body*/) {
      logger.info('results have been submitted.');
      emitter.emit('firework_submitted');
      isPostingResults = false;
      done();
    });
  }

  config = extend({}, defaults, config);

  if (!helper.isDefined(config.fireworkUrl)) {
    throw new Error('Firework URL must be set.');
  }

  switch(config.framework) {
    case 'mocha':
      adapter = require('./lib/MochaAdapter');
    break;

    case 'qunit':
      adapter = require('./lib/QUnitAdapter');
    break;

    case null:
    case undefined:
      adapter = require('./lib/GenericAdapter');
    break;

    default:
      throw new Error("Unknown test framework '" + config.framework + "'");
  }

  this.onRunStart = function(/*browsers*/) {
    collector = new Collector(adapter);
  };

  this.onSpecComplete = function(browser, result) {
    collector.gather(browser, result);
  };

  this.onRunComplete = function() {
    postResults(done);
    collector = null;
  };

  this.onExit = function(karmaDone) {
    if (isPostingResults) {
      done = karmaDone;
    }
    else {
      karmaDone();
    }
  };
};

FireworkReporter.$inject = [
  'config.fireworkReporter',
  'config.logLevel',
  'emitter',
  'logger',
  'helper',
];

module.exports = {
  'reporter:firework': ['type', FireworkReporter]
};
