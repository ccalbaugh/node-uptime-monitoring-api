const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

const server = http.createServer((req, res) => {
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
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    const data = {
      trimmedPath,
      query,
      method,
      headers,
      payload: buffer
    };

    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      payload = typeof payload == "object" ? payload : {};

      const payloadString = JSON.stringify(payload);

      res.writeHead(statusCode);

      res.end(payloadString);

      console.log(`Returning this response: ${statusCode}, ${payloadString}`);
    });
  });
});

server.listen(3000, () => {
  console.log("The server is listening on port 3000 now");
});

const handlers = {};

handlers.sample = (data, cb) => {
  cb(406, { name: "sample handlers" });
};

handlers.notFound = (data, cb) => {
  cb(404);
};

const router = {
  sample: handlers.sample
};
