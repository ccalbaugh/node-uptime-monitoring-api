const dgram = require("dgram");

const server = dgram.createSocket("udp4");

server.on("message", (buffer, sender) => {
  let messageString = buffer.toString();
  console.log(messageString);
});

server.bind(6000);
