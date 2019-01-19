const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  const { pathname, query } = parsedUrl;
  const trimmedPath = pathname.replace(/^\/+|\/+$/g, "");

  const method = req.method.toLowerCase();

  res.end("Hello World\n");

  console.log(
    `Request recieved on path: ${trimmedPath} with method: ${method} and with these query string parameters: ${JSON.stringify(
      query
    )}`
  );
});

server.listen(3000, () => {
  console.log("The server is listening on port 3000 now");
});
