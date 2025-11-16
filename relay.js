import { WebSocketServer } from "ws";
import dgram from "dgram";

const UDP_HOST = "127.0.0.1";
const UDP_PORT = 5683;

const PORT = process.env.PORT || 10000;

const wss = new WebSocketServer({ port: PORT });
console.log(`WebSocket → UDP Relay running on port ${PORT}`);

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (msg) => {
    console.log("WS → UDP:", msg.toString());

    const udp = dgram.createSocket("udp4");
    udp.send(msg, UDP_PORT, UDP_HOST, (err) => {
      if (err) console.error("UDP Send Error:", err);
      udp.close();
    });
  });

  ws.on("close", () => console.log("Client disconnected"));
});
