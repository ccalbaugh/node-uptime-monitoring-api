const server = require("./lib/server");
const workers = require("./lib/workers");
const cli = require("./lib/cli");
const cluster = require("cluster");
const os = require("os");

const app = {};

app.init = cb => {
  if (cluster.isMaster) {
    workers.init();

    setTimeout(() => {
      cli.init();
      cb();
    }, 50);

    const numberOfCores = os.cpus().length;

    for (let i = 0; i < numberOfCores; i++) {
      cluster.fork();
    }
  } else {
    // If not on the master thread, start HTTP server
    server.init();
  }
};

// Self invoking only if required directly
if (require.main === module) {
  app.init(() => {});
}

module.exports = app;
