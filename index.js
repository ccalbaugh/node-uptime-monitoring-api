const server = require("./lib/server");
const workers = require("./lib/workers");
const cli = require("./lib/cli");

const app = {};

app.init = cb => {
  server.init();

  workers.init();

  setTimeout(() => {
    cli.init();
    cb();
  }, 50);
};

// Self invoking only if required directly
if (require.main === module) {
  app.init(() => {});
}

module.exports = app;
