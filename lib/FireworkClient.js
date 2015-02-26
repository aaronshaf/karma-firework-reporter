var spawn = require('child_process').spawn;

/**
 *
 * @param {Object} config
 * @param {String} config.url
 *        URL to a Firework receiver. You can omit this if you're using a DB,
 *        but either a URL or a DB path must be specified.
 *
 * @param {String} config.db
 *        File path to an SQLite3 Firework database to output to.
 *
 * @param {String} config.path
 *        `firework_client` binary path.
 */
function FireworkClient(config) {
  var client;
  var clientOpts = [];

  if (config.db) {
    clientOpts = clientOpts.concat([ '-db', config.db ]);
  }

  if (config.url) {
    clientOpts = clientOpts.concat([ '-url', config.url ]);
  }

  if (clientOpts.length === 0) {
    throw new Error("Missing Firework reporter DB or URL config.");
  }

  client = spawn(config.path, [ '-stdin', ].concat(clientOpts), {
    stdio: ['pipe', process.stdout, process.stderr]
  });

  return {
    send: function(result) {
      if (client) {
        client.stdin.write(JSON.stringify(result) + '\n');
        return true;
      }
    },

    close: function(done) {
      client.kill();
      done();
    }
  };
}

module.exports = FireworkClient;