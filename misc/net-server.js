const net = require("net");

const server = net.createServer(connection => {
  const outboundMessage = "pong";

  connection.write(outboundMessage);

  connection.on("data", inboundMessage => {
    const messageString = inboundMessage.toString();

    console.log(`I wrote ${outboundMessage} and they said ${inboundMessage}`);
  });
});

server.listen(6000);
