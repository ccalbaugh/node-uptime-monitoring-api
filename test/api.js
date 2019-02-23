const app = require("../index");
const assert = require("assert");
const http = require("http");
const config = require("../lib/config");

const api = {};

const helpers = {};

helpers.makeGetRequest = (path, cb) => {
  const requestDetails = {
    protocol: "http:",
    hostname: "localhost",
    port: config.httpPort,
    method: "GET",
    path: path,
    headers: {
      "Content-Type": "application/json"
    }
  };

  const req = http.request(requestDetails, res => {
    cb(res);
  });

  req.end();
};

api["app.init should start without throwing"] = done => {
  assert.doesNotThrow(() => {
    app.init();
    done();
  }, TypeError);
};

api["/ping should respond to GET with 200"] = done => {
  const expectedResponse = 200;
  helpers.makeGetRequest("/ping", res => {
    assert.equal(res.statusCode, expectedResponse);
    done();
  });
};

api["/api/users should respond to GET with 400"] = done => {
  const expectedResponse = 400;
  helpers.makeGetRequest("/api/users", res => {
    assert.equal(res.statusCode, expectedResponse);
    done();
  });
};

api["A random path should respond to GET with 404"] = done => {
  const expectedResponse = 404;
  helpers.makeGetRequest("/this/is/not/a/real/path", res => {
    assert.equal(res.statusCode, expectedResponse);
    done();
  });
};

module.exports = api;
