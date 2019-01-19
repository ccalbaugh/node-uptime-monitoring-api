const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname } = parsedUrl;
  const trimmedPath = pathname.replace(/^\/+|\/+$/g, "");

  res.end("Hello World\n");

  console.log(`Request recieved on path ${trimmedPath}`);
});

server.listen(3000, () => {
  console.log("The server is listening on port 3000 now");
});
