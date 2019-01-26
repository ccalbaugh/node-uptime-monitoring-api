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
  fs.readdir(lib.baseDir, (err, logFiles) => {
    if (!err && logFiles && logFiles.length) {
      let trimmedFileNames = [];

      logFiles.forEach(fileName => {
        if (fileName.includes(".log")) {
          trimmedFileNames.push(fileName.replace(".log", ""));
        }

        if (fileName.includes(".gz.b64") && includeCompressedLogs) {
          trimmedFileNames.push(fileName.replace(".gz.b64", ""));
        }

        cb(false, trimmedFileNames);
      });
    } else {
      cb(err, logFiles);
    }
  });
};

lib.compress = (logId, newFileId, cb) => {
  const sourceFile = `${logId}.log`;
  const destinationFile = `${newFileId}.gz.b64`;

  fs.readFile(`${lib.baseDir}${sourceFile}`, "utf8", (err, inputStr) => {
    if (!err && inputStr) {
      zlib.gzip(inputStr, (err, buffer) => {
        console.log(`BUFFER ${buffer}`);
        if (!err && buffer) {
          fs.open(
            `${lib.baseDir}${destinationFile}`,
            "wx",
            (err, fileDescriptor) => {
              console.log(`FILE DESCRIPTOR: ${fileDescriptor}`);
              if (!err && fileDescriptor) {
                fs.writeFile(fileDescriptor, buffer.toString("base64"), err => {
                  if (!err) {
                    fs.close(fileDescriptor, err => {
                      if (!err) {
                        cb(false);
                      } else {
                        cb(err);
                      }
                    });
                  } else {
                    cb(err);
                  }
                });
              } else {
                cb(err);
              }
            }
          );
        } else {
          cb(err);
        }
      });
    } else {
      cb(err);
    }
  });
};

lib.decompress = (fileId, cb) => {
  const fileName = `${fileId}.gz.b64`;
  fs.readFile(`${lib.baseDir}${fileName}`, "utf8", (err, str) => {
    if (!err && str) {
      const inputBuffer = Buffer.from(str, "base64");

      zlib.unzip(inputBuffer, (err, outputBuffer) => {
        if (!err && outputBuffer) {
          const str = outputBuffer.toString();

          cb(false, str);
        } else {
          cb(err);
        }
      });
    } else {
      cb(err);
    }
  });
};

module.exports = lib;
