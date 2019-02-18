const readline = require("readline");
const util = require("util");
const debug = util.debuglog("cli");
const events = require("events");

class _events extends events {}

const e = new _events();

const cli = {};

module.exports = cli;
