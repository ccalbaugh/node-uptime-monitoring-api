const net = require("net");

const outboundMessage = "ping";

const client = net.createConnection(
  {
    port: 6000
  },
  () => {
    client.write(outboundMessage);
  }
);

client.on("data", inboundMessage => {
  const messageString = inboundMessage.toString();

  console.log(`I wrote ${outboundMessage} and they said ${inboundMessage}`);
  client.end();
});
