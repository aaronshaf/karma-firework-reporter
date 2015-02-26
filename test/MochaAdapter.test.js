var subject = require("../lib/MochaAdapter");
var expect = require("chai").expect;

describe("MochaAdapter", function() {
  var FIXTURE_ASSERTION_ERROR = "AssertionError: expected true to equal false\n  at Assertion.assertEqual (webpack:///./~/chai/lib/chai/core/assertions.js?:429:12)\n    at Assertion.ctx.(anonymous function) [as equal] (webpack:///./~/chai/lib/chai/utils/addMethod.js?:40:25)\n    at Context.eval (webpack:///./jsapp/shared/components/__tests__/ChartElement.test.js?:32:36)";
  var FIXTURE_REFERENCE_ERROR = "ReferenceError: asdf is not defined\n    at Context.eval (webpack:///./jsapp/shared/components/__tests__/ChartElement.test.js?:27:7)";

  it("should extract the error string", function() {
    expect(subject(FIXTURE_ASSERTION_ERROR).details).
      to.equal("AssertionError: expected true to equal false");

    expect(subject(FIXTURE_REFERENCE_ERROR).details).
      to.equal("ReferenceError: asdf is not defined");
  });

  it("should extract the backtrace", function() {
    expect(subject(FIXTURE_ASSERTION_ERROR).backtrace).
      to.equal(
        [
          "at Assertion.assertEqual (webpack:///./~/chai/lib/chai/core/assertions.js?:429:12)",
          "at Assertion.ctx.(anonymous function) [as equal] (webpack:///./~/chai/lib/chai/utils/addMethod.js?:40:25)",
          "at Context.eval (webpack:///./jsapp/shared/components/__tests__/ChartElement.test.js?:32:36)"
        ].join("\n")
      );
  });
});