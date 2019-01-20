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

    res.end("Hello World\n");

    console.log(`Request recieved with this payload: ${buffer}`);
  });
});

server.listen(3000, () => {
  console.log("The server is listening on port 3000 now");
});

const handlers = {};

handlers.sample = (data, cb) => {};

handlers.notFound = (data, cb) => {};

const router = {
  sample: handlers.sample
};
