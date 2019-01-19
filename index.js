const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  const { headers, url: requestUrl } = req;
  const parsedUrl = url.parse(requestUrl, true);

  const { pathname, query } = parsedUrl;
  const trimmedPath = pathname.replace(/^\/+|\/+$/g, "");

  const method = req.method.toLowerCase();

  res.end("Hello World\n");

  console.log(
    `Request recieved with these headers: ${JSON.stringify(headers, null, 2)}`
  );
});

server.listen(3000, () => {
  console.log("The server is listening on port 3000 now");
});
