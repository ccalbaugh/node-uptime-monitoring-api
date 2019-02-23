process.env.NODE_ENV = "testing";

_app = {};

_app.tests = {};

_app.tests.unit = require("./unit");

_app.countTests = () => {
  let counter = 0;

  for (let key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      let subTests = _app.tests[key];

      for (let test in subTests) {
        if (subTests.hasOwnProperty(test)) {
          counter++;
        }
      }
    }
  }

  return counter;
};

_app.produceTestReport = (limit, successes, errors) => {
  console.log("");
  console.log("---------------BEGIN TEST REPORT---------------");
  console.log("");
  console.log("Total Tests: ", limit);
  console.log("Passed: ", successes);
  console.log("Failed: ", errors.length);
  console.log("");

  if (errors.length) {
    console.log("---------------BEGIN ERROR DETAILS---------------");
    console.log("");

    errors.forEach(testError => {
      console.log("\x1b[31m%s\x1b[0m", testError.name);
      console.log(testError.error);
      console.log("");
    });

    console.log("---------------END ERROR DETAILS---------------");
  }

  console.log("");
  console.log("---------------END TEST REPORT---------------");
};

_app.runTests = () => {
  let errors = [];
  let successes = 0;
  let limit = _app.countTests();
  let counter = 0;

  for (let key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      let subtests = _app.tests[key];
      for (let test in subtests) {
        if (subtests.hasOwnProperty(test)) {
          (function() {
            let tempTestName = test;
            let testValue = subtests[test];

            try {
              testValue(() => {
                console.log("\x1b[32m%s\x1b[0m", tempTestName);
                counter++;
                successes++;

                if (counter === limit) {
                  _app.produceTestReport(limit, successes, errors);
                }
              });
            } catch (error) {
              errors.push({
                name: test,
                error
              });

              console.log("\x1b[32m%s\x1b[0m", tempTestName);
              counter++;

              if (counter === limit) {
                _app.produceTestReport(limit, successes, errors);
              }
            }
          })();
        }
      }
    }
  }
};

_app.runTests();
