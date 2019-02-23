const app = require("../index");
const assert = require("assert");
const http = require("http");
const config = require("../lib/config");

const api = {};

const helpers = {};

helpers.makeGetRequest = (path, cb) => {
  const requestDetails = {
    protocol: "http",
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

modules.exports = api;
