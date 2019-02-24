const _data = require("./data");
const helpers = require("./helpers");
const config = require("./config");
const _url = require("url");
const dns = require("dns");
const _performance = require("perf_hooks").performance;
const util = require("util");
const debug = util.debuglog("performance");

const ACCEPTABLE_METHODS = ["post", "get", "put", "delete"];

const ONE_HOUR = 1000 * 60 * 60;

const handlers = {};

handlers.index = (data, cb) => {
  if (data.method == "get") {
    const templateData = {
      "head.title": "Uptime Monitoring",
      "head.description":
        "Offers free uptime monitoring for HTTP/HTTPS requests.  When your app goes down we will send you a text to let you know",
      "body.class": "index"
    };

    helpers.getTemplate("index", templateData, (err, str) => {
      if (!err && str) {
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
          if (!err && fullString) {
            cb(200, fullString, "html");
          } else {
            cb(500, undefined, "html");
          }
        });
      } else {
        cb(500, undefined, "html");
      }
    });
  } else {
    cb(405, undefined, "html");
  }
};

handlers.accountCreate = (data, cb) => {
  if (data.method == "get") {
    const templateData = {
      "head.title": "Create an Account",
      "head.description": "Signup is easy and only take a few seconds",
      "body.class": "accountCreate"
    };

    helpers.getTemplate("accountCreate", templateData, (err, str) => {
      if (!err && str) {
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
          if (!err && fullString) {
            cb(200, fullString, "html");
          } else {
            cb(500, undefined, "html");
          }
        });
      } else {
        cb(500, undefined, "html");
      }
    });
  } else {
    cb(405, undefined, "html");
  }
};

handlers.sessionCreate = (data, cb) => {
  if (data.method == "get") {
    const templateData = {
      "head.title": "Login to your Account",
      "head.description":
        "Please enter your phone number and password to access your account",
      "body.class": "sessionCreate"
    };

    helpers.getTemplate("sessionCreate", templateData, (err, str) => {
      if (!err && str) {
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
          if (!err && fullString) {
            cb(200, fullString, "html");
          } else {
            cb(500, undefined, "html");
          }
        });
      } else {
        cb(500, undefined, "html");
      }
    });
  } else {
    cb(405, undefined, "html");
  }
};

handlers.sessionDeleted = (data, cb) => {
  if (data.method == "get") {
    const templateData = {
      "head.title": "Logged Out",
      "head.description": "You have been logged out of your account",
      "body.class": "sessionDeleted"
    };

    helpers.getTemplate("sessionDeleted", templateData, (err, str) => {
      if (!err && str) {
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
          if (!err && fullString) {
            cb(200, fullString, "html");
          } else {
            cb(500, undefined, "html");
          }
        });
      } else {
        cb(500, undefined, "html");
      }
    });
  } else {
    cb(405, undefined, "html");
  }
};

handlers.accountEdit = (data, cb) => {
  if (data.method == "get") {
    const templateData = {
      "head.title": "Edit Your Account",
      "body.class": "accountEdit"
    };

    helpers.getTemplate("accountEdit", templateData, (err, str) => {
      if (!err && str) {
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
          if (!err && fullString) {
            cb(200, fullString, "html");
          } else {
            cb(500, undefined, "html");
          }
        });
      } else {
        cb(500, undefined, "html");
      }
    });
  } else {
    cb(405, undefined, "html");
  }
};

handlers.accountDeleted = (data, cb) => {
  if (data.method == "get") {
    const templateData = {
      "head.title": "Your Account was Deleted",
      "head.description": "Your account has been deleted",
      "body.class": "accountDeleted"
    };

    helpers.getTemplate("accountDeleted", templateData, (err, str) => {
      if (!err && str) {
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
          if (!err && fullString) {
            cb(200, fullString, "html");
          } else {
            cb(500, undefined, "html");
          }
        });
      } else {
        cb(500, undefined, "html");
      }
    });
  } else {
    cb(405, undefined, "html");
  }
};

handlers.checksCreate = (data, cb) => {
  if (data.method == "get") {
    const templateData = {
      "head.title": "Create a New Check",
      "body.class": "checksCreate"
    };

    helpers.getTemplate("checksCreate", templateData, (err, str) => {
      if (!err && str) {
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
          if (!err && fullString) {
            cb(200, fullString, "html");
          } else {
            cb(500, undefined, "html");
          }
        });
      } else {
        cb(500, undefined, "html");
      }
    });
  } else {
    cb(405, undefined, "html");
  }
};

handlers.checksList = (data, cb) => {
  if (data.method == "get") {
    const templateData = {
      "head.title": "Dashboard",
      "body.class": "checksList"
    };

    helpers.getTemplate("checksList", templateData, (err, str) => {
      if (!err && str) {
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
          if (!err && fullString) {
            cb(200, fullString, "html");
          } else {
            cb(500, undefined, "html");
          }
        });
      } else {
        cb(500, undefined, "html");
      }
    });
  } else {
    cb(405, undefined, "html");
  }
};

handlers.checksEdit = (data, cb) => {
  if (data.method == "get") {
    const templateData = {
      "head.title": "Check Details",
      "body.class": "checksEdit"
    };

    helpers.getTemplate("checksEdit", templateData, (err, str) => {
      if (!err && str) {
        helpers.addUniversalTemplates(str, templateData, (err, fullString) => {
          if (!err && fullString) {
            cb(200, fullString, "html");
          } else {
            cb(500, undefined, "html");
          }
        });
      } else {
        cb(500, undefined, "html");
      }
    });
  } else {
    cb(405, undefined, "html");
  }
};

handlers.favicon = (data, cb) => {
  if (data.method == "get") {
    helpers.getStaticAsset("favicon.ico", (err, data) => {
      if (!err && data) {
        cb(200, data, "favicon");
      } else {
        cb(500);
      }
    });
  } else {
    cb(405);
  }
};

handlers.public = (data, cb) => {
  if (data.method == "get") {
    const trimmedAssetName = data.trimmedPath.replace("public/", "");

    if (trimmedAssetName.length) {
      helpers.getStaticAsset(trimmedAssetName, (err, data) => {
        if (!err && data) {
          let contentType = "plain";

          if (trimmedAssetName.includes(".css")) {
            contentType = "css";
          }

          if (trimmedAssetName.includes(".png")) {
            contentType = "png";
          }

          if (trimmedAssetName.includes(".jpg")) {
            contentType = "jpg";
          }

          if (trimmedAssetName.includes(".ico")) {
            contentType = "favicon";
          }

          cb(200, data, contentType);
        } else {
          cb(404);
        }
      });
    } else {
      cb(404);
    }
  } else {
    cb(405);
  }
};

handlers.exampleError = (data, cb) => {
  const err = new Error("This is an example error");
  throw err;
};

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
        _data.read("users", phone, (err, userData) => {
          if (!err && userData) {
            _data.delete("users", phone, err => {
              if (!err) {
                const userChecks =
                  typeof userData.checks == "object" &&
                  userData.checks instanceof Array
                    ? userData.checks
                    : [];

                if (userChecks.length) {
                  let checksDeleted = 0;
                  let deletionErrors = false;

                  userChecks.forEach(checkId => {
                    _data.delete("checks", checkId, err => {
                      if (err) {
                        deletionErrors = true;
                      }
                      checksDeleted++;

                      if (checksDeleted === userChecks.length) {
                        if (!deletionErrors) {
                          cb(200);
                        } else {
                          cb(500, {
                            Error:
                              "Errors encountered while attempting to delete all of the user checks.  All checks may not have been deleted from the system succesfully"
                          });
                        }
                      }
                    });
                  });
                } else {
                  cb(200);
                }
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
  _performance.mark("entered function");
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

  _performance.mark("inputs validated");
  if (phone && password) {
    _performance.mark("beginning user lookup");
    _data.read("users", phone, (err, userData) => {
      _performance.mark("user lookup complete");
      if (!err && userData) {
        _performance.mark("beginning password hashing");
        const hashedPassword = helpers.hash(password);
        _performance.mark("completed password hashing");

        if (hashedPassword === userData.hashedPassword) {
          _performance.mark("creating token data");

          const tokenId = helpers.createRandomString(20);
          const expires = Date.now() + ONE_HOUR;
          const tokenObject = {
            phone,
            id: tokenId,
            expires
          };
          _performance.mark("beginning storing token");

          _data.create("tokens", tokenId, tokenObject, err => {
            _performance.mark("storing token complete");

            _performance.measure(
              "Beginning to end",
              "entered function",
              "storing token complete"
            );
            _performance.measure(
              "Validating User Input",
              "entered function",
              "inputs validated"
            );
            _performance.measure(
              "User Lookup",
              "beginning user lookup",
              "user lookup complete"
            );
            _performance.measure(
              "Password Hashing",
              "beginning password hashing",
              "completed password hashing"
            );
            _performance.measure(
              "Token Data Creation",
              "creating token data",
              "beginning storing token"
            );
            _performance.measure(
              "Token Storing",
              "beginning storing token",
              "storing token complete"
            );

            const measurements = _performance.getEntriesByType("measure");

            measurements.forEach(measurement => {
              debug(
                "\x1b[33m%s\x1b[0m",
                `${measurement.name} ${measurement.duration}`
              );
            });

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
                const parsedUrl = _url.parse(`${protocol}://${url}`, true);
                const hostName =
                  typeof parsedUrl.hostname == "string" &&
                  parsedUrl.hostname.length
                    ? parsedUrl.hostname
                    : false;

                dns.resolve(hostName, (err, records) => {
                  if (!err && records) {
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

                        _data.update(
                          "users",
                          userPhone,
                          updatedUserData,
                          err => {
                            if (!err) {
                              cb(200, checkObj);
                            } else {
                              cb(500, {
                                Error:
                                  "Could not update the user with the new check"
                              });
                            }
                          }
                        );
                      } else {
                        cb(500, { Error: "Could not create the new check" });
                      }
                    });
                  } else {
                    cb(400, {
                      Error:
                        "The hostname of the URL entered did not resolve to any DNS entries"
                    });
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

handlers._checks.get = (data, cb) => {
  const rawIdData = data.query.id;
  const id =
    typeof rawIdData == "string" && rawIdData.trim().length === 20
      ? rawIdData.trim()
      : false;

  if (id) {
    _data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        const token =
          typeof data.headers.token == "string" ? data.headers.token : false;

        handlers._tokens.verifyToken(
          token,
          checkData.userPhone,
          tokenIsValid => {
            if (tokenIsValid) {
              cb(200, checkData);
            } else {
              cb(403);
            }
          }
        );
      } else {
        cb(404);
      }
    });
  } else {
    cb(400, { Error: "Missing required field" });
  }
};

handlers._checks.put = (data, cb) => {
  const acceptableProtocols = ["http", "https"];
  const id =
    typeof data.payload.id == "string" && data.payload.id.trim().length === 20
      ? data.payload.id.trim()
      : false;

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

  if (id && (protocol || url || method || successCodes || timeoutSeconds)) {
    _data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        const token =
          typeof data.headers.token == "string" ? data.headers.token : false;

        handlers._tokens.verifyToken(
          token,
          checkData.userPhone,
          tokenIsValid => {
            if (tokenIsValid) {
              if (protocol) {
                checkData.protocol = protocol;
              }
              if (url) {
                checkData.url = url;
              }
              if (method) {
                checkData.method = method;
              }
              if (successCodes) {
                checkData.successCodes = successCodes;
              }
              if (timeoutSeconds) {
                checkData.timeoutSeconds = timeoutSeconds;
              }

              _data.update("checks", id, checkData, err => {
                if (!err) {
                  cb(200);
                } else {
                  cb(500, { Error: "Could not update the check data" });
                }
              });
            } else {
              cb(403);
            }
          }
        );
      } else {
        cb(400, { Error: "Check id did not exist" });
      }
    });
  } else {
    cb(400, { Error: "Missing field(s) to update" });
  }
};

handlers._checks.delete = (data, cb) => {
  const checkId =
    typeof data.query.id == "string" && data.query.id.trim().length === 20
      ? data.query.id.trim()
      : false;

  if (checkId) {
    _data.read("checks", checkId, (err, checkData) => {
      if (!err && checkData) {
        const token =
          typeof data.headers.token == "string" ? data.headers.token : false;

        handlers._tokens.verifyToken(
          token,
          checkData.userPhone,
          tokenIsValid => {
            if (tokenIsValid) {
              _data.delete("checks", checkId, err => {
                if (!err) {
                  _data.read("users", checkData.userPhone, (err, userData) => {
                    if (!err && userData) {
                      const updatedUserData = {
                        ...userData,
                        checks: userData.checks.filter(
                          check => check !== checkId
                        )
                      };

                      _data.update(
                        "users",
                        checkData.userPhone,
                        updatedUserData,
                        err => {
                          if (!err) {
                            cb(200);
                          } else {
                            cb(500, {
                              Error: "Could not delete the specified check"
                            });
                          }
                        }
                      );
                    } else {
                      cb(500, {
                        Error:
                          "Could not find the specified user who owned the check"
                      });
                    }
                  });
                } else {
                  cb(500, { Error: "Could not delete the check data" });
                }
              });
            } else {
              cb(403, {
                Error: "Missing required token in header or token is invalid"
              });
            }
          }
        );
      } else {
        cb(400, { Error: "The specified checkId does not exist" });
      }
    });
  } else {
    cb(400, { Error: "Missing required field" });
  }
};

handlers.ping = (data, cb) => {
  cb(200);
};

handlers.notFound = (data, cb) => {
  cb(404);
};

module.exports = handlers;
