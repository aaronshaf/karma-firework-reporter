var sinon = require("sinon");
var request = require("request");
var Subject = require("../index");
var expect = require("chai").expect;
var events = require("karma/lib/events");
var logger = require("karma/lib/logger");

describe("karma-firework-reporter", function() {
  var subject;
  var emitter = new events.EventEmitter();
  var createSubject = function(config) {
    return new Subject['reporter:firework'][1](config, null, emitter, logger,
      require("karma/lib/helper")
    );
  };

  describe("gathering results", function() {
    it("should gather result from a passing spec");
    it("should gather result and extra details from a failing spec");
  });

  describe("submitting results", function() {
    var sandbox = sinon.sandbox.create({ useFakeServer: false });

    afterEach(function() {
      sandbox.restore();
    });

    it("should work", function() {
      var postSpy = sandbox.spy(request, "post");

      subject = createSubject({
        fireworkUrl: "http://firework.com"
      });

      subject.onRunStart();
      subject.onSpecComplete({
        name: "Some Browser",
        lastResult: { netTime: 10 }
      }, {
        success: true,
        description: "it should work",
        suite: "foo::bar"
      });

      subject.onRunComplete();

      expect(postSpy.called).to.equal(true);
      expect(postSpy.firstCall.args[0].url).
        to.equal("http://firework.com/api/result_batch");

      var postedPayload = JSON.parse(postSpy.firstCall.args[0].body);
      var postedResults = Object.keys(postedPayload);

      expect(postedResults).to.contain("results");

      var postedResult = postedPayload.results[0];

      expect(postedResult["success"]).to.equal(true);
      expect(postedResult["browser"]).to.equal("Some Browser");
      expect(postedResult["test"]).to.equal("it should work");
      expect(postedResult["context"]).to.equal("foo::bar");
      expect(postedResult["duration_ms"]).to.equal(10);
    });
  });
});