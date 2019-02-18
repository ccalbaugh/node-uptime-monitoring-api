const readline = require("readline");
const util = require("util");
const debug = util.debuglog("cli");
const events = require("events");
const config = require("./config");

class _events extends events {}

const e = new _events();

const cli = {};

cli.processInput = str => {
  str = typeof str == "string" && str.trim().length > 0 ? str.trim() : false;

  if (str) {
    let matchFound = false;
    let counter = 0;
    config.uniqueInputs.some(input => {
      if (str.toLowerCase().includes(input)) {
        matchFound = true;

        e.emit(input, str);

        return true;
      }
    });

    if (!matchFound) {
      console.log("Sorry, try again");
    }
  }
};

cli.init = () => {
  console.log("\x1b[34m%s\x1b[0m", `The CLI is running`);

  const _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ""
  });

  _interface.prompt();

  _interface.on("line", str => {
    cli.processInput(str);

    _interface.prompt();
  });

  _interface.on("close", () => {
    process.exit(0);
  });
};

module.exports = cli;
