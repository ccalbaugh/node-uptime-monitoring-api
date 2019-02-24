const path = require("path");
const fs = require("fs");
const http = require("http");
const https = require("https");
const _url = require("url");
const util = require("util");
const helpers = require("./helpers");
const _logs = require("./logs");
const _data = require("./data");

const debug = util.debuglog("workers");

const ACCEPTABLE_METHODS = ["post", "get", "put", "delete"];

const ONE_MINUTE = 1000 * 60;

const ONE_DAY = ONE_MINUTE * 60 * 24;

const workers = {};

workers.gatherAllChecks = () => {
  _data.list("checks", (err, checks) => {
    if (!err && checks && checks.length > 0) {
      checks.forEach(check => {
        _data.read("checks", check, (err, originalCheckData) => {
          if (!err && originalCheckData) {
            workers.validateCheckData(originalCheckData);
          } else {
            debug("Error reading one of the check's data");
          }
        });
      });
    } else {
      debug("Error: Could not find any checks to process");
    }
  });
};

workers.validateCheckData = originalCheckData => {
  originalCheckData =
    typeof originalCheckData == "object" && originalCheckData !== null
      ? originalCheckData
      : {};

  let {
    id,
    userPhone,
    protocol,
    url,
    method,
    successCodes,
    timeoutSeconds
  } = originalCheckData;

  id = typeof id == "string" && id.trim().length == 20 ? id.trim() : false;

  userPhone =
    typeof userPhone == "string" && userPhone.trim().length == 10
      ? userPhone.trim()
      : false;

  protocol =
    typeof protocol == "string" && ["http", "https"].includes(protocol)
      ? protocol
      : false;

  url = typeof url == "string" && url.trim().length > 0 ? url.trim() : false;

  method =
    typeof method == "string" && ACCEPTABLE_METHODS.includes(method)
      ? method
      : false;

  successCodes =
    typeof successCodes == "object" &&
    successCodes instanceof Array &&
    successCodes.length > 0
      ? successCodes
      : false;

  timeoutSeconds =
    typeof timeoutSeconds == "number" &&
    timeoutSeconds % 1 === 0 &&
    timeoutSeconds >= 1 &&
    timeoutSeconds <= 5
      ? timeoutSeconds
      : false;

  originalCheckData.state =
    typeof originalCheckData.state == "string" &&
    ["up", "down"].includes(originalCheckData.state)
      ? originalCheckData.state
      : "down";

  originalCheckData.lastChecked =
    typeof originalCheckData.lastChecked == "number" &&
    originalCheckData.lastChecked > 0
      ? originalCheckData.lastChecked
      : true;

  if (
    id &&
    userPhone &&
    protocol &&
    url &&
    method &&
    successCodes &&
    timeoutSeconds
  ) {
    workers.performCheck(originalCheckData);
  } else {
    debug(
      `Error: One of the checks is not properly formatted. Skipping check data: ${JSON.stringify(
        originalCheckData,
        null,
        2
      )}`
    );
  }
};

workers.performCheck = originalCheckData => {
  const { protocol, method, timeoutSeconds } = originalCheckData;

  const checkOutcome = {
    error: null,
    responseCode: false
  };
  let outcomeSent = false;
  let parsedUrl = _url.parse(
    `${originalCheckData.protocol}://${originalCheckData.url}`,
    true
  );
  const { hostName, path } = parsedUrl;

  const requestDetails = {
    protocol: `${protocol}:`,
    hostName,
    method: method.toUpperCase(),
    path,
    timeout: timeoutSeconds * 1000
  };

  const _moduleToUse = originalCheckData.protocol == "http" ? http : https;

  const req = _moduleToUse.request(requestDetails, res => {
    const status = res.statusCode;

    checkOutcome.responseCode = status;

    if (!outcomeSent) {
      workers.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  req.on("error", err => {
    checkOutcome.error = {
      error: true,
      value: err
    };

    if (!outcomeSent) {
      workers.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  req.on("timeout", err => {
    checkOutcome.error = {
      error: true,
      value: "timeout"
    };

    if (!outcomeSent) {
      workers.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  req.end();
};

workers.processCheckOutcome = (originalCheckData, checkOutcome) => {
  const state =
    !checkOutcome.error &&
    checkOutcome.responseCode &&
    originalCheckData.successCodes.includes(checkOutcome.responseCode)
      ? "up"
      : "down";

  const alertWarranted =
    originalCheckData.lastChecked && originalCheckData.state !== state
      ? true
      : false;

  const timeOfCheck = Date.now();

  const newCheckData = {
    ...originalCheckData,
    state,
    lastChecked: timeOfCheck
  };

  workers.log(
    originalCheckData,
    checkOutcome,
    state,
    alertWarranted,
    timeOfCheck
  );

  _data.update("checks", newCheckData.id, newCheckData, err => {
    if (!err) {
      if (alertWarranted) {
        workers.alertUserToStatusChange(newCheckData);
      } else {
        debug("Check outcome has not changed, no alert needed");
      }
    } else {
      debug("Error trying to save updates to one of the checks");
    }
  });
};

workers.alertUserToStatusChange = newCheckData => {
  let msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${
    newCheckData.protocol
  }://${newCheckData.url} is currently ${newCheckData.state}`;

  helpers.sendTwilioSms(newCheckData.userPhone, msg, err => {
    if (!err) {
      debug(
        `Success: User was alerted to a status change in their check, via sms: ${msg}`
      );
    } else {
      debug(
        `Error: Could not send sms alert to user who had a state change in their check`
      );
    }
  });
};

workers.log = (
  originalCheckData,
  checkOutcome,
  state,
  alertWarranted,
  timeOfCheck
) => {
  const logData = {
    check: originalCheckData,
    outcome: checkOutcome,
    state,
    alert: alertWarranted,
    time: timeOfCheck
  };

  const logString = JSON.stringify(logData);

  const logFileName = originalCheckData.id;

  _logs.append(logFileName, logString, err => {
    if (!err) {
      debug("Logging to file succeeded");
    } else {
      debug("Logging to file failed");
    }
  });
};

workers.loop = () => {
  setInterval(() => {
    workers.gatherAllChecks();
  }, ONE_MINUTE);
};

workers.rotateLogs = () => {
  _logs.list(false, (err, logs) => {
    if (!err && logs && logs.length > 0) {
      logs.forEach(logName => {
        const logId = logName.replace(".log", "");
        const newFileId = `${logId}-${Date.now()}`;

        _logs.compress(logId, newFileId, err => {
          if (!err) {
            _logs.truncate(logId, err => {
              if (!err) {
                debug("Success truncating log file");
              } else {
                debug("Error truncating log file");
              }
            });
          } else {
            debug(`Error compressing one of the log files: ${err}`);
          }
        });
      });
    } else {
      debug("Error: Could not find any logs to rotate");
    }
  });
};

workers.logRotationLoop = () => {
  setInterval(() => {
    workers.rotateLogs();
  }, ONE_DAY);
};

workers.init = () => {
  console.log("\x1b[33m%s\x1b[0m", "Background workers are running");

  workers.gatherAllChecks();

  workers.loop();

  workers.rotateLogs();

  workers.logRotationLoop();
};

module.exports = workers;
