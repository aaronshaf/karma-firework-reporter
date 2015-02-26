var LINEBREAK = "\n";
var TRACE_INDICATOR = 'at ';

/**
 * Extract failure information from a failed mocha spec log.
 *
 * @param  {String[]} log
 *
 * @return {Object} output
 * @return {String} output.backtrace
 * @return {String} output.details
 */
module.exports = function(logEntry) {
  var lines;
  var result = {};

  if (logEntry) {
    lines = logEntry.split(LINEBREAK).map(function(line) {
      return line.trim();
    });

    result.backtrace = lines.filter(function(line) {
      return line.indexOf(TRACE_INDICATOR) === 0;
    }).join(LINEBREAK);

    result.details = lines.filter(function(line) {
      return line.indexOf(TRACE_INDICATOR) === -1;
    }).join(LINEBREAK);
  }

  return result;
};