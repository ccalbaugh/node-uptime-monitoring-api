const _data = require("./data");
const helpers = require("./helpers");

const ACCEPTABLE_METHODS = ["post", "get", "put", "delete"];

const handlers = {};

handlers.users = (data, cb) => {
  if (ACCEPTABLE_METHODS.includes(data.method)) {
    handlers._users[data.method](data, cb);
  } else {
    cb(405);
  }
};

handlers._users = {};

handlers._users.post = (data, cb) => {
  const firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;

  const lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;

  const phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;

  const password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  const tosAgreement =
    typeof data.payload.tosAgreement == "boolean" && data.payload.tosAgreement
      ? true
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    _data.read("users", phone, (err, data) => {
      if (err) {
        const hashedPassword = helpers.hash(password);

        if (hashedPassword) {
          const userObject = {
            firstName,
            lastName,
            phone,
            hashedPassword,
            tosAgreement: true
          };

          _data.create("users", phone, userObject, err => {
            if (!err) {
              cb(200);
            } else {
              console.log(err);
              cb(500, { Error: "Could not create the new user" });
            }
          });
        } else {
          cb(500, { Error: "Could not hash the users password" });
        }
      } else {
        cb(400, { Error: "A user with that phone number already exists" });
      }
    });
  } else {
    cb(400, { Error: "Missing required fields" });
  }
};

handlers._users.get = (data, cb) => {
  const rawPhoneData = data.query.phone;
  const phone =
    typeof rawPhoneData == "string" && rawPhoneData.trim().length === 10
      ? rawPhoneData.trim()
      : false;

  if (phone) {
    const token =
      typeof data.headers.token == "string" ? data.headers.token : false;

    handlers._tokens.verifyToken(token, phone, tokenIsValid => {
      if (tokenIsValid) {
        _data.read("users", phone, (err, data) => {
          if (!err && data) {
            delete data.hashedPassword;
            cb(200, data);
          } else {
            cb(404);
          }
        });
      } else {
        cb(403, {
          Error: "Missing required token in header or token is invalid"
        });
      }
    });
  } else {
    cb(400, { Error: "Missing required field" });
  }
};

handlers._users.put = (data, cb) => {
  const firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;

  const lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;

  const phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;

  const password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      const token =
        typeof data.headers.token == "string" ? data.headers.token : false;

      handlers._tokens.verifyToken(token, phone, tokenIsValid => {
        if (tokenIsValid) {
          _data.read("users", phone, (err, userData) => {
            if (!err && userData) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.password = helpers.hash(password);
              }

              _data.update("users", phone, userData, err => {
                if (!err) {
                  cb(200);
                } else {
                  console.log(err);
                  cb(500, { Error: "Could not update the user" });
                }
              });
            } else {
              cb(400, { Error: "The specified user does not exist" });
            }
          });
        } else {
          cb(403, {
            Error: "Missing required token in header or token is invalid"
          });
        }
      });
    } else {
      cb(400, { Error: "Missing fields to update" });
    }
  } else {
    cb(400, { Error: "Missing required field" });
  }
};

handlers._users.delete = (data, cb) => {
  const rawPhoneData = data.query.phone;
  const phone =
    typeof rawPhoneData == "string" && rawPhoneData.trim().length === 10
      ? rawPhoneData.trim()
      : false;

  if (phone) {
    const token =
      typeof data.headers.token == "string" ? data.headers.token : false;

    handlers._tokens.verifyToken(token, phone, tokenIsValid => {
      if (tokenIsValid) {
        _data.read("users", phone, (err, data) => {
          if (!err && data) {
            _data.delete("users", phone, err => {
              if (!err) {
                cb(200);
              } else {
                cb(500, { Error: "Could not delete the specified user" });
              }
            });
          } else {
            cb(400, { Error: "Could not find the specified user" });
          }
        });
      } else {
        cb(403, {
          Error: "Missing required token in header or token is invalid"
        });
      }
    });
  } else {
    cb(400, { Error: "Missing required field" });
  }
};

handlers.tokens = (data, cb) => {
  if (ACCEPTABLE_METHODS.includes(data.method)) {
    handlers._tokens[data.method](data, cb);
  } else {
    cb(405);
  }
};

handlers._tokens = {};

handlers._tokens.post = (data, cb) => {
  const phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;

  const password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  if (phone && password) {
    _data.read("users", phone, (err, userData) => {
      if (!err && userData) {
        const hashedPassword = helpers.hash(password);

        if (hashedPassword === userData.hashedPassword) {
          const tokenId = helpers.createRandomString(20);
          const expires = Date.now() + 1000 * 60 * 60;
          const tokenObject = {
            phone,
            id: tokenId,
            expires
          };

          _data.create("tokens", tokenId, tokenObject, err => {
            if (!err) {
              cb(200, tokenObject);
            } else {
              cb(500, { Error: "Could not create the new token" });
            }
          });
        } else {
          cb(400, {
            Error: "Password did not match the specified users stored password"
          });
        }
      } else {
        cb(400, { Error: "Could not find the specified user" });
      }
    });
  }
};

handlers._tokens.get = (data, cb) => {
  const idData = data.query.id;
  const id =
    typeof idData == "string" && idData.trim().length == 20
      ? idData.trim()
      : false;

  if (id) {
    _data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        cb(200, tokenData);
      } else {
        cb(404);
      }
    });
  } else {
    cb(400, { Error: "Missing required field" });
  }
};

handlers._tokens.put = (data, cb) => {
  const id =
    typeof data.payload.id == "string" && data.payload.id.trim().length == 20
      ? data.payload.id.trim()
      : false;

  const extend =
    typeof data.payload.extend == "boolean" && data.payload.extend == true
      ? true
      : false;

  if (id && extend) {
    _data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        if (tokenData.expires > Date.now()) {
          tokenData.expires = Date.now() + 1000 * 60 * 60;

          _data.update("tokens", id, tokenData, err => {
            if (!err) {
              cb(200);
            } else {
              cb(500, { Error: "Could not extend the token expiration" });
            }
          });
        } else {
          cb(400, {
            Error: "The token has already expired and cannot be extended"
          });
        }
      } else {
        cb(400, { Error: "Specified token does not exist" });
      }
    });
  } else {
    cb(400, { Error: "Missing required field(s) or field(s) are invalid" });
  }
};

handlers._tokens.delete = (data, cb) => {
  const rawIdData = data.query.id;
  const id =
    typeof rawIdData == "string" && rawIdData.trim().length === 20
      ? rawIdData.trim()
      : false;

  if (id) {
    _data.read("tokens", id, (err, data) => {
      if (!err && data) {
        _data.delete("tokens", id, err => {
          if (!err) {
            cb(200);
          } else {
            cb(500, { Error: "Could not delete the specified token" });
          }
        });
      } else {
        cb(400, { Error: "Could not find the specified token" });
      }
    });
  } else {
    cb(400, { Error: "Missing required field" });
  }
};

handlers._tokens.verifyToken = (id, phone, cb) => {
  _data.read("tokens", id, (err, tokenData) => {
    if (!err && tokenData) {
      if (tokenData.phone == phone && tokenData.expires > Date.now()) {
        cb(true);
      } else {
        cb(false);
      }
    } else {
      cb(false);
    }
  });
};

handlers.checks = (data, cb) => {
  if (ACCEPTABLE_METHODS.includes(data.method)) {
    handlers._checks[data.method](data, cb);
  } else {
    cb(405);
  }
};

handlers._checks = {};

handlers._checks.post = (data, cb) => {
  const acceptableProtocols = ["http", "https"];
  const protocol =
    typeof data.payload.protocol == "string" &&
    acceptableProtocols.includes(data.payload.protocol)
      ? data.payload.protocol
      : false;

  const url =
    typeof data.payload.url == "string" && data.payload.url.trim().length > 0
      ? data.payload.url.trim()
      : false;

  const method =
    typeof data.payload.method == "string" &&
    ACCEPTABLE_METHODS.includes(data.payload.method)
      ? data.payload.method
      : false;

  const successCodes =
    typeof data.payload.successCodes == "object" &&
    data.payload.successCodes instanceof Array &&
    data.payload.successCodes.length > 0
      ? data.payload.successCodes
      : false;

  const timeoutSeconds =
    typeof data.payload.timeoutSeconds == "number" &&
    data.payload.timeoutSeconds % 1 === 0 &&
    data.payload.timeoutSeconds >= 1 &&
    data.payload.timeoutSeconds <= 5
      ? data.payload.timeoutSeconds
      : false;

  if (protocol && url && method && successCodes && timeoutSeconds) {
    const token =
      typeof data.headers.token == "string" ? data.headers.token : false;

    _data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        const userPhone = tokenData.phone;

        if (tokenData.expires > Date.now()) {
          _data.read("users", userPhone, (err, userData) => {
            if (!err && userData) {
              const userChecks =
                typeof userData.checks == "object" &&
                userData.checks instanceof Array
                  ? userData.checks
                  : [];

              if (userChecks.length < config.maxChecks) {
                const checkId = helpers.createRandomString(20);
                const checkObj = {
                  id: checkId,
                  userPhone,
                  protocol,
                  url,
                  method,
                  successCodes,
                  timeoutSeconds
                };

                _data.create("checks", checkId, checkObj, err => {
                  if (!err) {
                    const updatedUserData = {
                      ...userData,
                      checks: [...userChecks, checkId]
                    };

                    _data.update("users", userPhone, updatedUserData, err => {
                      if (!err) {
                        cb(200, checkObj);
                      } else {
                        cb(500, {
                          Error: "Could not update the user with the new check"
                        });
                      }
                    });
                  } else {
                    cb(500, { Error: "Could not create the new check" });
                  }
                });
              } else {
                cb(400, {
                  Error: `The user already has the maximum number of checks (${
                    config.maxChecks
                  })`
                });
              }
            } else {
              cb(403);
            }
          });
        }
      } else {
        cb(403);
      }
    });
  } else {
    cb(400, { Error: "Missing required inputs, or inputs are invalid" });
  }
};

handlers.ping = (data, cb) => {
  cb(200);
};

handlers.notFound = (data, cb) => {
  cb(404);
};

module.exports = handlers;
