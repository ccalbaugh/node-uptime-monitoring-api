const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const lib = {};

lib.baseDir = path.join(__dirname, "/../.logs/");

lib.append = (file, str, cb) => {
  fs.open(`${lib.baseDir}${file}.log`, "a", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      fs.appendFile(fileDescriptor, `${str}\n`, err => {
        if (!err) {
          fs.close(fileDescriptor, err => {
            if (!err) {
              cb(false);
            } else {
              cb("Error closing file that was being appended");
            }
          });
        } else {
          cb("Error appending to file");
        }
      });
    } else {
      cb("Could not open file for appending");
    }
  });
};

lib.list = (includeCompressedLogs, cb) => {
  fs.readdir(lib.baseDir, (err, logData) => {
    if (!err && logData && logData.length) {
      let trimmedFileNames = [];

      logData.forEach(fileName => {
        if (fileName.includes(".log")) {
          trimmedFileNames.push(fileName.replace(".log", ""));
        }

        if (fileName.includes(".gz.b64") && includeCompressedLogs) {
          trimmedFileNames.push(fileName.replace(".gz.b64", ""));
        }

        cb(false, trimmedFileNames);
      });
    } else {
      cb(err, logData);
    }
  });
};

module.exports = lib;
