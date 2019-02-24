const readline = require("readline");
const util = require("util");
const debug = util.debuglog("cli");
const events = require("events");
const config = require("./config");
const os = require("os");
const v8 = require("v8");
const _data = require("./data");
const _logs = require("./logs");
const helpers = require("./helpers");
const childProcess = require("child_process");

class _events extends events {}

const e = new _events();

const cli = {};

e.on("man", str => {
  cli.responders.help();
});

e.on("help", str => {
  cli.responders.help();
});

e.on("exit", str => {
  cli.responders.exit();
});

e.on("stats", str => {
  cli.responders.stats();
});

e.on("list users", str => {
  cli.responders.listUsers();
});

e.on("more user info", str => {
  cli.responders.moreUserInfo(str);
});

e.on("list checks", str => {
  cli.responders.listChecks(str);
});

e.on("more check info", str => {
  cli.responders.moreCheckInfo(str);
});

e.on("list logs", str => {
  cli.responders.listLogs();
});

e.on("more log info", str => {
  cli.responders.moreLogInfo(str);
});

cli.responders = {};

cli.responders.help = () => {
  const commands = {
    exit: "Kill the CLI (and the rest of the application)",
    man: "Show this help page",
    help: 'Alias of the "man" command',
    stats:
      "Get statistics on the underlying operating system and resource utilization",
    "List users":
      "Show a list of all the registered (undeleted) users in the system",
    "More user info --{userId}": "Show details of a specified user",
    "List checks --up --down":
      'Show a list of all the active checks in the system, including their state. The "--up" and "--down flags are both optional."',
    "More check info --{checkId}": "Show details of a specified check",
    "List logs":
      "Show a list of all the log files available to be read (compressed only)",
    "More log info --{logFileName}": "Show details of a specified log file"
  };

  cli.horizontalLine();
  cli.centered("CLI MANUAL");
  cli.horizontalLine();
  cli.verticalSpace(2);

  for (let key in commands) {
    if (commands.hasOwnProperty(key)) {
      let value = commands[key];
      let line = `\x1b[33m${key}\x1b[0m`;
      const padding = 60 - line.length;

      for (let i = 0; i < padding; i++) {
        line += " ";
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }

  cli.verticalSpace(1);

  cli.horizontalLine();
};

cli.verticalSpace = lines => {
  lines = typeof lines == "number" && lines > 0 ? lines : 1;

  for (let i = 0; i < lines; i++) {
    console.log("");
  }
};

cli.horizontalLine = () => {
  const width = process.stdout.columns;
  let line = "";

  for (let i = 0; i < width; i++) {
    line += "-";
  }
  console.log(line);
};

cli.centered = str => {
  str = typeof str == "string" && str.trim().length > 0 ? str.trim() : "";

  const width = process.stdout.columns;

  const leftPadding = Math.floor((width - str.length) / 2);

  let line = "";

  for (let i = 0; i < leftPadding; i++) {
    line += " ";
  }
  line += str;

  console.log(line);
};

cli.responders.exit = () => {
  process.exit(0);
};

cli.responders.stats = () => {
  const stats = {
    "Load Average": os.loadavg().join(" "),
    "CPU Count": os.cpus().length,
    "Free Memory": os.freemem(),
    "Current Malloced Memory": v8.getHeapStatistics().malloced_memory,
    "Peak Malloced Memory": v8.getHeapStatistics().peak_malloced_memory,
    "Allocated Heap Used (%)": Math.round(
      (v8.getHeapStatistics().used_heap_size /
        v8.getHeapStatistics().total_heap_size) *
        100
    ),
    "Available Heap Allocated (%)": Math.round(
      (v8.getHeapStatistics().total_heap_size /
        v8.getHeapStatistics().heap_size_limit) *
        100
    ),
    Uptime: `${os.uptime()} Seconds`
  };

  cli.horizontalLine();
  cli.centered("SYSTEM STATISTICS");
  cli.horizontalLine();
  cli.verticalSpace(2);

  for (let key in stats) {
    if (stats.hasOwnProperty(key)) {
      let value = stats[key];
      let line = `\x1b[33m${key}\x1b[0m`;
      const padding = 60 - line.length;

      for (let i = 0; i < padding; i++) {
        line += " ";
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }

  cli.verticalSpace(1);

  cli.horizontalLine();
};

cli.responders.listUsers = () => {
  _data.list("users", (err, userIds) => {
    if (!err && userIds && userIds.length > 0) {
      cli.verticalSpace();
      userIds.forEach(userId => {
        _data.read("users", userId, (err, userData) => {
          if (!err && userData) {
            const numberOfChecks =
              typeof userData.checks == "object" &&
              userData.checks instanceof Array &&
              userData.checks.length
                ? userData.checks.length
                : 0;
            const line = `Name: ${userData.firstName} ${
              userData.lastName
            } Phone: ${userData.phone} Checks: ${numberOfChecks}`;
            console.log(line);
            cli.verticalSpace();
          }
        });
      });
    }
  });
};

cli.responders.moreUserInfo = str => {
  const [command, untrimmedUserId] = str.split("--");
  const userId =
    typeof untrimmedUserId == "string" && untrimmedUserId.trim().length
      ? untrimmedUserId.trim()
      : false;

  if (userId) {
    _data.read("users", userId, (err, userData) => {
      if (!err && userData) {
        delete userData.hashedPassword;

        cli.verticalSpace();
        console.dir(userData, { colors: true });
        cli.verticalSpace();
      }
    });
  }
};

cli.responders.listChecks = str => {
  _data.list("checks", (err, checkIds) => {
    if (!err && checkIds && checkIds.length) {
      cli.verticalSpace();
      checkIds.forEach(checkId => {
        _data.read("checks", checkId, (err, checkData) => {
          if (!err && checkData) {
            let includeCheck = false;
            const lowerString = str.toLowerCase();
            const state =
              typeof checkData.state == "string" ? checkData.state : "down";
            const stateOrUnknown =
              typeof checkData.state == "string" ? checkData.state : "unknown";

            if (
              lowerString.includes(`--${state}`) ||
              !lowerString.includes("--down") ||
              lowerString.includes("--up")
            ) {
              const line = `ID: ${
                checkData.id
              } ${checkData.method.toUpperCase()} ${checkData.protocol}://${
                checkData.url
              } State: ${stateOrUnknown}`;

              console.log(line);
              cli.verticalSpace();
            }
          }
        });
      });
    }
  });
};

cli.responders.moreCheckInfo = str => {
  const [command, untrimmedCheckId] = str.split("--");
  const checkId =
    typeof untrimmedCheckId == "string" && untrimmedCheckId.trim().length
      ? untrimmedCheckId.trim()
      : false;

  if (checkId) {
    _data.read("checks", checkId, (err, checkData) => {
      if (!err && checkData) {
        cli.verticalSpace();
        console.dir(checkData, { colors: true });
        cli.verticalSpace();
      }
    });
  }
};

cli.responders.listLogs = () => {
  const ls = childProcess.spawn("ls", ["./.logs/"]);

  ls.stdout.on("data", dataObj => {
    const dataStr = dataObj.toString();
    const logFileNames = dataStr.split("\n");

    cli.verticalSpace();

    logFileNames.forEach(logFileName => {
      if (
        typeof logFileName == "string" &&
        logFileName.length &&
        logFileName.includes("-")
      ) {
        console.log(logFileName.trim().split(".")[0]);
        cli.verticalSpace();
      }
    });
  });
};

cli.responders.moreLogInfo = str => {
  const [command, untrimmedLogFileName] = str.split("--");
  const logFileName =
    typeof untrimmedLogFileName == "string" &&
    untrimmedLogFileName.trim().length
      ? untrimmedLogFileName.trim()
      : false;

  if (logFileName) {
    cli.verticalSpace();
    _logs.decompress(logFileName, (err, strData) => {
      if (!err && strData) {
        const arr = strData.split("\n");
        arr.forEach(jsonString => {
          const logObject = helpers.parseJsonToObject(jsonString);
          if (logObject && JSON.stringify(logObject) !== "{}") {
            console.dir(logObject, { colors: true });
            cli.verticalSpace();
          }
        });
      }
    });
  }
};

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
    prompt: "> "
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
