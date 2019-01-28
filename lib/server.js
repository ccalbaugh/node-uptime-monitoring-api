const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");
const url = require("url");
const util = require("util");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const handlers = require("./handlers");
const helpers = require("./helpers");

const debug = util.debuglog("server");

const server = {};

server.httpServer = http.createServer((req, res) => {
  server.unifiedServer(req, res);
});

server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, "/../https/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "/../https/cert.pem"))
};

server.httpsServer = https.createServer(
  server.httpsServerOptions,
  (req, res) => {
    server.unifiedServer(req, res);
  }
);

server.unifiedServer = (req, res) => {
  const { headers, url: requestUrl } = req;
  const parsedUrl = url.parse(requestUrl, true);

  const { pathname, query } = parsedUrl;
  const trimmedPath = pathname.replace(/^\/+|\/+$/g, "");

  const method = req.method.toLowerCase();

  const decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", data => {
    buffer = buffer.concat(decoder.write(data));
  });

  req.on("end", () => {
    buffer = buffer.concat(decoder.end());

    let chosenHandler =
      typeof server.router[trimmedPath] !== "undefined"
        ? server.router[trimmedPath]
        : handlers.notFound;

    chosenHandler = trimmedPath.includes("public/")
      ? handlers.public
      : chosenHandler;

    const data = {
      trimmedPath,
      query,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer)
    };

    chosenHandler(data, (statusCode, payload, contentType) => {
      contentType = typeof contentType == "string" ? contentType : "json";

      statusCode = typeof statusCode == "number" ? statusCode : 200;

      let payloadString = "";

      if (contentType == "json") {
        res.setHeader("Content-Type", "application/json");

        payload = typeof payload == "object" ? payload : {};
        payloadString = JSON.stringify(payload);
      }

      if (contentType == "html") {
        res.setHeader("Content-Type", "text/html");

        payloadString = typeof payload == "string" ? payload : "";
      }

      if (contentType == "favicon") {
        res.setHeader("Content-Type", "image/x-icon");

        payloadString = typeof payload !== "undefined" ? payload : "";
      }

      if (contentType == "css") {
        res.setHeader("Content-Type", "text/css");

        payloadString = typeof payload !== "undefined" ? payload : "";
      }

      if (contentType == "png") {
        res.setHeader("Content-Type", "image/png");

        payloadString = typeof payload !== "undefined" ? payload : "";
      }

      if (contentType == "jpg") {
        res.setHeader("Content-Type", "image/jpg");

        payloadString = typeof payload !== "undefined" ? payload : "";
      }

      if (contentType == "plain") {
        res.setHeader("Content-Type", "text/plain");

        payloadString = typeof payload !== "undefined" ? payload : "";
      }

      res.writeHead(statusCode);
      res.end(payloadString);

      if (statusCode == 200) {
        debug(
          "\x1b[32m%s\x1b[0m",
          ` ${method.toUpperCase()} /${trimmedPath} ${statusCode}`
        );
      } else {
        debug(
          "\x1b[31m%s\x1b[0m",
          ` ${method.toUpperCase()} /${trimmedPath} ${statusCode}`
        );
      }
    });
  });
};

server.router = {
  "": handlers.index,
  "account/create": handlers.accountCreate,
  "account/edit": handlers.accountEdit,
  "account/deleted": handlers.accountDeleted,
  "session/create": handlers.sessionCreate,
  "session/deleted": handlers.sessionDeleted,
  "checks/all": handlers.checksList,
  "checks/create": handlers.checksCreate,
  "checks/edit": handlers.checksEdit,
  "api/checks": handlers.checks,
  ping: handlers.ping,
  "api/users": handlers.users,
  "api/tokens": handlers.tokens,
  "favicon.ico": handlers.favicon,
  public: handlers.public
};

server.init = () => {
  server.httpServer.listen(config.httpPort, () => {
    console.log(
      "\x1b[36m%s\x1b[0m",
      `The server is listening on port ${config.httpPort}`
    );
  });

  server.httpsServer.listen(config.httpsPort, () => {
    console.log(
      "\x1b[35m%s\x1b[0m",
      `The server is listening on port ${config.httpsPort}`
    );
  });
};

module.exports = server;
