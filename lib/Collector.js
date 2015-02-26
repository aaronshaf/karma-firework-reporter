var extend = require("lodash").extend;
var ENV = process.env;

function Collector(extractFailureDetails) {
  var report = {
    project: ENV.GERRIT_PROJECT,
    results: []
  };

  if (ENV.GERRIT_CHANGE_NUMBER) {
    report.run = {};
    report.run.gerrit_change_id = ENV.GERRIT_CHANGE_NUMBER;

    if (ENV.GERRIT_PATCHSET_NUMBER) {
      report.run.gerrit_change_patchset = ENV.GERRIT_PATCHSET_NUMBER;
    }

    if (ENV.GERRIT_CHANGE_URL) {
      report.run.url = ENV.GERRIT_CHANGE_URL;
    }
  }

  if (ENV.JOB_NAME) {
    report.build = {};
    report.build.ci_project = ENV.JOB_NAME;

    if (ENV.BUILD_NUMBER) {
      report.build.ci_build_id = ENV.BUILD_NUMBER;
    }

    if (ENV.BUILD_URL) {
      report.build.url = ENV.BUILD_URL;
    }
  }

  this.toJSON = function() {
    return JSON.stringify(report);
  };

  this.gather = function(browser, result) {
    var fireworkResult = {
      success: result.success,
      browser: browser.name,
      test: result.description,
      context: result.suite,
      duration_ms: browser.lastResult.netTime,
    };

    if (!result.success && !result.skipped) {
      if (result.log && result.log.length > 0) {
        extend(fireworkResult, extractFailureDetails(result.log[0]));
      }
    }

    report.results.push(fireworkResult);
  };

  this.getSize = function() {
    return report.results.length;
  };

  return this;
}

module.exports = Collector;