const handlers = {};

handlers.users = (data, cb) => {
  const acceptableMethods = ["post", "get", "put", "delete"];

  if (acceptableMethods.includes(data.method)) {
    handlers._users[data.method](data, cb);
  } else {
    cb(405);
  }
};

handlers._users = {};

handlers._users.post = (data, cb) => {};

handlers._users.get = (data, cb) => {};

handlers._users.put = (data, cb) => {};

handlers._users.delete = (data, cb) => {};

handlers.ping = (data, cb) => {
  cb(200);
};

handlers.notFound = (data, cb) => {
  cb(404);
};

module.exports = handlers;
