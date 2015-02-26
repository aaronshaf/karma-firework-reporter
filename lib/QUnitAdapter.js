var pick = require('lodash').pick;
var extend = require('lodash').extend;
var QUnitParser = require('qunit-parser');

/**
 * Extract failure information from a failed QUnit spec log.
 *
 * @param  {String[]} log
 *
 * @return {Object} output
 * @return {String} output.actual
 * @return {String} output.expected
 * @return {String} output.backtrace
 * @return {String} output.details
 */
module.exports = function(log) {
  var parsedLog = QUnitParser.parseLog(log);

  return extend(pick(parsedLog, 'actual', 'expected', 'backtrace'), {
    details: parsedLog.description
  });
};