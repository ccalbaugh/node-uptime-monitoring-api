const fs = require("fs");
const path = require("path");

const lib = {};

lib.baseDir = path.join(__dirname, "/../.data");

lib.create = (dir, file, data, cb) => {
  const jsonifiedFile = `${lib.baseDir}/${dir}/${file}.json`;

  fs.open(jsonifiedFile, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);

      fs.writeFile(fileDescriptor, stringData, err => {
        if (!err) {
          fs.close(fileDescriptor, err => {
            if (!err) {
              cb(false);
            } else {
              cb("Error closing file");
            }
          });
        } else {
          cb("Error writing to new file");
        }
      });
    } else {
      cb("Could not create new file, it may already exist");
    }
  });
};

lib.read = (dir, filename, cb) => {
  const filePath = `${lib.baseDir}/${dir}/${filename}.json`;

  fs.readFile(filePath, "utf-8", (err, data) => {
    cb(err, data);
  });
};

lib.update = (dir, filename, data, cb) => {
  const filePath = `${lib.baseDir}/${dir}/${filename}.json`;

  fs.open(filePath, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);

      fs.truncate(fileDescriptor, err => {
        if (!err) {
          fs.writeFile(fileDescriptor, stringData, err => {
            if (!err) {
              fs.close(fileDescriptor, err => {
                if (!err) {
                  cb(false);
                } else {
                  cb("Error closing the file");
                }
              });
            } else {
              cb("Error writing to existing file");
            }
          });
        } else {
          cb("Error truncating file");
        }
      });
    } else {
      cb("Could not open the file for updating, it may not exist yet");
    }
  });
};

module.exports = lib;
