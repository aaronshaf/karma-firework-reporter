var Subject = require("../index");
var expect = require("chai").expect;
var exec = require('child_process').exec;

describe("karma-firework-reporter", function() {
  var subject;
  var createSubject = function(config) {
    return new Subject['reporter:firework'][1](config);
  };

  describe("gathering results", function() {
    it("should gather result from a passing spec");
    it("should gather result and extra details from a failing spec");
  });

  describe("submitting results", function() {
    before(function() {
      exec("firework_client -init=./test-db.sqlite");
    });

    after(function() {
      exec("rm ./test-db.sqlite");
    });

    it("should work", function(done) {
      subject = createSubject({
        fireworkDatabase: "./test-db.sqlite"
      });

      expect(function() {
        subject.onSpecComplete({
          name: "Some Browser",
          lastResult: { netTime: 10 }
        }, {
          success: true,
          description: "it should work",
          suite: "foo::bar"
        });
      }).to.not.throw();

      subject.onExit(done);
    });
  });
});