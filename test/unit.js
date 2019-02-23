const helpers = require("../lib/helpers");
const assert = require("assert");
const logs = require("../lib/logs");

const unit = {};

unit["helpers.getANumber should return a number"] = done => {
  const actualValue = typeof helpers.getANumber();
  const expectedValue = "number";

  assert.equal(actualValue, expectedValue);

  done();
};

unit["helpers.getANumber should return 1"] = done => {
  const actualValue = helpers.getANumber();
  const expectedValue = 1;

  assert.equal(actualValue, expectedValue);

  done();
};

unit["helpers.getANumber should return 2"] = done => {
  const actualValue = helpers.getANumber();
  const expectedValue = 2;

  assert.equal(actualValue, expectedValue);

  done();
};

unit[
  "logs.list should callback a false error and an array of log names"
] = done => {
  logs.list(true, (err, logFileNames) => {
    assert.equal(err, false);
    assert.ok(logFileNames instanceof Array);
    assert.ok(logFileNames.length);
    done();
  });
};

unit[
  "logs.truncate should not throw if the log id does not exist. It should callback an error instead"
] = done => {
  assert.doesNotThrow(() => {
    logs.truncate("I do not exist", err => {
      assert.ok(err);
      done();
    });
  }, TypeError);
};

module.exports = unit;
