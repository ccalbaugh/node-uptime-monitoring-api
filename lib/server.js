const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const handlers = require("./handlers");
const helpers = require("./helpers");

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

    const chosenHandler =
      typeof server.router[trimmedPath] !== "undefined"
        ? server.router[trimmedPath]
        : handlers.notFound;

    const data = {
      trimmedPath,
      query,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer)
    };

    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      payload = typeof payload == "object" ? payload : {};

      const payloadString = JSON.stringify(payload);

      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      console.log(`Returning this response: ${statusCode}, ${payloadString}`);
    });
  });
};

server.router = {
  checks: handlers.checks,
  ping: handlers.ping,
  users: handlers.users,
  tokens: handlers.tokens
};

server.init = () => {
  server.httpServer.listen(config.httpPort, () => {
    console.log(`The server is listening on port ${config.httpPort}`);
  });

  server.httpsServer.listen(config.httpsPort, () => {
    console.log(`The server is listening on port ${config.httpsPort}`);
  });
};

module.exports = server;
